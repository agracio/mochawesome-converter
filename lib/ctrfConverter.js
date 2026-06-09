"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = exports.CtrfConverter = void 0;
const fs = __importStar(require("fs"));
const crypto = __importStar(require("crypto"));
const lodash_1 = __importDefault(require("lodash"));
const mochawesomeCommon_1 = require("./mochawesomeCommon");
class CtrfConverter {
    constructor() {
        this.suites = {};
        this.results = [];
        this.avg = 0;
        this.duration = 0;
    }
    readCtrfReport(options) {
        return new Promise((resolve, reject) => {
            fs.promises.readFile(options.testFile, 'utf8')
                .then((content) => {
                try {
                    resolve(JSON.parse(content));
                }
                catch (error) {
                    reject(new Error(`Failed to parse ${options.testFile} as CTRF report: ${error}`));
                }
            })
                .catch((error) => {
                reject(new Error(`Failed to read ${options.testFile}: ${error}`));
            });
        });
    }
    getProperties(title, value, context) {
        if (value) {
            context.push({
                title: title,
                value: JSON.stringify(value, null, 2),
            });
        }
    }
    getStdOut(title, value, context) {
        if (value) {
            context.push({
                title: title,
                value: value.join('\n'),
            });
        }
    }
    getContext(test) {
        let context;
        if (test.stdout || test.stderr || test.parameters || test.steps) {
            context = [];
            this.getProperties('Parameters', test.parameters, context);
            this.getProperties('Steps', test.steps, context);
            this.getStdOut('stdout', test.stdout, context);
            this.getStdOut('stderr', test.stderr, context);
        }
        return context;
    }
    getError(test) {
        if (test.message || test.trace) {
            return {
                message: test.message,
                estack: test.trace ? mochawesomeCommon_1.MochawesomeCommon.sanitizeStackTrace(test.trace) : undefined,
                diff: null,
            };
        }
        return {};
    }
    addTestStatus(status, test, mochaTest) {
        if (test.status === 'failed') {
            status.failures.push(mochaTest.uuid);
        }
        else if (test.status === 'pending') {
            status.pending.push(mochaTest.uuid);
        }
        else if (test.status === 'skipped') {
            status.skipped.push(mochaTest.uuid);
        }
        else if (test.status === 'passed') {
            status.passes.push(mochaTest.uuid);
        }
        else if (test.status === 'other' && (test.rawStatus === 'NotExecuted' || test.rawStatus === 'Inconclusive')) {
            status.skipped.push(mochaTest.uuid);
        }
    }
    parseTests(report) {
        const mediumTime = Math.ceil(this.avg / 2);
        let suiteName = null;
        report.results.tests.forEach((test) => {
            let uuid = test.id || crypto.randomUUID();
            let err = {};
            if (test.suite && test.suite.length > 0) {
                if (typeof test.suite === 'string') {
                    suiteName = test.suite;
                }
                else if (Array.isArray(test.suite)) {
                    suiteName = test.suite.join(' > ');
                }
            }
            if (suiteName) {
                if (!this.suites[suiteName]) {
                    this.suites[suiteName] = {
                        file: '',
                        uuid: crypto.randomUUID(),
                        title: suiteName,
                        tests: [],
                        suites: [],
                        beforeHooks: [],
                        afterHooks: [],
                        passes: [],
                        failures: [],
                        pending: [],
                        skipped: [],
                        duration: 0,
                        root: false,
                        rootEmpty: false,
                        _timeout: 10000,
                    };
                }
            }
            let speed = 'fast';
            const duration = test.duration ? Math.ceil(test.duration) : 0;
            if (this.duration !== 0 && test.duration) {
                if (duration >= this.avg) {
                    speed = 'slow';
                }
                else if (duration >= mediumTime) {
                    speed = 'medium';
                }
                else {
                    speed = 'fast';
                }
            }
            const context = this.getContext(test);
            err = this.getError(test);
            const mochaTest = {
                title: suiteName ? test.name.replace(`${suiteName}: `, '') : test.name,
                fullTitle: test.name,
                duration: test.duration,
                state: test.status,
                speed: speed,
                pass: test.status === 'passed',
                fail: test.status === 'failed',
                pending: test.status === 'pending',
                context: context ? JSON.stringify(context) : null,
                code: test.snippet,
                err: err,
                uuid: uuid,
                parentUUID: suiteName ? this.suites[suiteName].uuid : this.results[0].uuid,
                isHook: false,
                skipped: test.status === 'skipped' || (test.status === 'other' && (test.rawStatus === 'NotExecuted' || test.rawStatus === 'Inconclusive')),
            };
            if (suiteName) {
                this.suites[suiteName].tests.push(mochaTest);
                this.addTestStatus(this.suites[suiteName], test, mochaTest);
                this.suites[suiteName].duration += duration;
            }
            else {
                this.results[0].tests.push(mochaTest);
                this.addTestStatus(this.results[0], test, mochaTest);
                this.results[0].rootEmpty = false;
                this.results[0].duration += duration;
            }
        });
        let suites = lodash_1.default.sortBy(Object.values(this.suites), ['title']);
        suites.forEach(suite => {
            let tests = lodash_1.default.sortBy(suite.tests, ['title']);
            suite.tests = tests;
            this.results[0].suites.push(suite);
        });
        if (this.results[0].tests.length > 0) {
            this.results[0].tests = lodash_1.default.sortBy(this.results[0].tests, ['title']);
        }
    }
    /**
     * @param {ConverterOptions} options
     */
    async convert(options) {
        const report = await this.readCtrfReport(options);
        if (!report.results || !report.results.tests) {
            return Promise.reject(`No test results found in the CTRF report: ${options.testFile}`);
        }
        if (!report.results.summary) {
            return Promise.reject(`No summary found in the CTRF report: ${options.testFile}`);
        }
        this.suites = {};
        this.results = [];
        this.avg = 0;
        this.duration = 0;
        this.results.push(mochawesomeCommon_1.MochawesomeCommon.createResult(report.reportId || null, report.results.environment?.reportName || '', []));
        let pendingPercent = 0;
        this.duration =
            report.results.summary.duration
                ? Number(report.results.summary.duration)
                : lodash_1.default.sumBy(report.results.tests, function (test) {
                    return Number(test.duration) || 0;
                });
        let tests = report.results.summary.tests || report.results.tests.length;
        if (tests !== 0) {
            this.avg = Math.ceil((this.duration) / tests);
        }
        let pending = Number(report.results.summary.pending);
        let skipped = Number(report.results.summary.skipped);
        let failed = Number(report.results.summary.failed);
        let other = Number(report.results.summary.other);
        let passes = Number(report.results.summary.passed);
        report.results.tests.forEach((test) => {
            if (test.status === 'other' && (test.rawStatus === 'NotExecuted' || test.rawStatus === 'Inconclusive')) {
                skipped++;
                other--;
            }
        });
        if (tests !== 0) {
            pendingPercent = (pending / tests) * 100;
        }
        this.parseTests(report);
        const stats = mochawesomeCommon_1.MochawesomeCommon.createStats(Object.values(this.suites).length, tests, passes, failed, pending, skipped, options, pendingPercent, other, Math.ceil(this.duration));
        const mochawesome = {
            stats: stats,
            results: this.results,
        };
        return mochawesomeCommon_1.MochawesomeCommon.createMargeReport(mochawesome, options);
    }
}
exports.CtrfConverter = CtrfConverter;
const processor = new CtrfConverter();
const convert = (options) => processor.convert(options);
exports.convert = convert;
//# sourceMappingURL=ctrfConverter.js.map