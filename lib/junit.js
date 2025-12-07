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
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = exports.prepareJson = exports.JsonProcessor = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const mochawesome_report_generator_1 = require("mochawesome-report-generator");
const _ = __importStar(require("lodash"));
class JsonProcessor {
    constructor() {
        this.skippedTests = 0;
        this.failedTests = 0;
        this.suites = [];
    }
    prepareJson(options, json) {
        if ((json && json.testsuites && json.testsuites.length && json.testsuites.length === 0) ||
            !json ||
            !json.testsuites ||
            !json.testsuites.length ||
            !json.testsuites[0].testsuite ||
            !json.testsuites[0].testsuite.length ||
            json.testsuites[0].testsuite.length === 0) {
            console.log('No test suites found, skipping Mochawesome file creation.');
            return null;
        }
        if (options.saveIntermediateFiles) {
            const fileName = `${path.parse(options.testFile).name}-converted.json`;
            fs.writeFileSync(path.join(options.reportDir, fileName), JSON.stringify(json, null, 2), 'utf8');
        }
        // sort test suites
        if (json.testsuites[0].testsuite[0].file && json.testsuites[0].testsuite[0].name) {
            json.testsuites[0].testsuite = _.sortBy(json.testsuites[0].testsuite, ['file', 'name']);
        }
        else if (json.testsuites[0].testsuite[0].name) {
            json.testsuites[0].testsuite = _.sortBy(json.testsuites[0].testsuite, ['name']);
        }
        return json.testsuites[0];
    }
    /**
     * @param {TestCase} testcase
     * @returns {ErrorMessage|{}}
     */
    getError(testcase) {
        if (!testcase.failure && !testcase.error) {
            return {};
        }
        let estack;
        let message;
        const failure = testcase.failure ? testcase.failure : testcase.error;
        const fail = failure[0];
        const prefix = fail.type ? `${fail.type}: ` : '';
        const diff = null;
        if (fail.message) {
            message = `${prefix}${fail.message.replaceAll('&#xD;', '').replaceAll('&#xA;', '')}`;
        }
        if (fail.$t) {
            estack = fail.$t
                .replaceAll('&#xD;', '')
                .replaceAll('&#x27;', "'")
                .replaceAll('&#x3C;', '<')
                .replaceAll('&#x3E;', '>')
                .replaceAll('&#x22;', '"');
        }
        else if (typeof fail === 'string') {
            estack = fail;
        }
        return {
            message: message,
            estack: estack,
            diff: diff,
        };
    }
    /**
     * @param {TestCase} testcase
     */
    getContext(testcase) {
        let context;
        if ((testcase.skipped && testcase.skipped[0].message) ||
            (testcase.properties && testcase.properties.length !== 0 && testcase.properties[0].property) ||
            (testcase['system-out'] && testcase['system-out'].length !== 0) ||
            (testcase['system-err'] && testcase['system-err'].length !== 0)) {
            context = [];
            let skipped = '';
            if (testcase.properties && testcase.properties.length !== 0 && testcase.properties[0].property) {
                const properties = [];
                testcase.properties[0].property.forEach((property) => {
                    properties.push(`${property.name}: ${property.value}`);
                });
                context.push({
                    title: 'Properties',
                    value: properties,
                });
            }
            if (testcase.skipped && testcase.skipped[0].message) {
                skipped = testcase.skipped[0].message
                    .replaceAll('&#xD;', '')
                    .replaceAll('&#x27;', "'")
                    .replaceAll('&#x3C;', '<')
                    .replaceAll('&#x3E;', '>')
                    .replaceAll('&#x22;', '"');
                context.push(`skipped: ${skipped}`);
            }
            if (testcase['system-out'] && testcase['system-out'].length !== 0) {
                this.extractSystemMessage('system-out', skipped, testcase['system-out'][0], context);
            }
            if (testcase['system-err'] && testcase['system-err'].length !== 0) {
                this.extractSystemMessage('system-err', skipped, testcase['system-err'][0], context);
            }
        }
        return context;
    }
    extractSystemMessage(name, skipped, systemMessage, context) {
        let message = systemMessage;
        if (systemMessage.$t) {
            message = systemMessage.$t
                .replaceAll('&#xD;', '')
                .replaceAll('&#x27;', "'")
                .replaceAll('&#x3C;', '<')
                .replaceAll('&#x3E;', '>')
                .replaceAll('&#x22;', '"');
        }
        if (message !== skipped) {
            context.push({
                title: name,
                value: message,
            });
        }
    }
    /**
     * @param {ConverterOptions} options
     * @param {[TestSuite]} testSuites
     * @param {Number} totalSuitTime
     * @param {Number} avgSuitTime
     */
    parseTestSuites(options, testSuites, totalSuitTime, avgSuitTime) {
        const mediumTime = Math.ceil(avgSuitTime / 2);
        testSuites.forEach((suite) => {
            const tests = [];
            const passes = [];
            const failures = [];
            const pending = [];
            const parentUUID = crypto.randomUUID();
            let suiteDuration = 0;
            suite.testcase.forEach((testcase) => {
                const context = this.getContext(testcase);
                let err = {};
                const uuid = crypto.randomUUID();
                let state = 'passed';
                if ((testcase.status && testcase.status.toLowerCase() === 'failed') || testcase.failure || testcase.error) {
                    err = this.getError(testcase);
                    state = 'failed';
                    this.failedTests++;
                }
                if ((testcase.status && testcase.status.toLowerCase() === 'skipped') || testcase.skipped) {
                    state = options.skippedAsPending ? 'pending' : 'skipped';
                    this.skippedTests++;
                }
                let speed = 'fast';
                const duration = testcase.time ? Math.ceil(Number(testcase.time) * 1000) : 0;
                suiteDuration += duration;
                if (totalSuitTime && totalSuitTime !== 0 && testcase.time) {
                    if (duration >= avgSuitTime) {
                        speed = 'slow';
                    }
                    else if (duration >= mediumTime) {
                        speed = 'medium';
                    }
                    else {
                        speed = 'fast';
                    }
                }
                const test = {
                    title: options.switchClassnameAndName ? testcase.classname : testcase.name,
                    fullTitle: options.switchClassnameAndName ? testcase.name : testcase.classname,
                    duration: duration,
                    state: state,
                    speed: speed,
                    pass: !(testcase.failure || testcase.error || testcase.skipped),
                    fail: testcase.failure || testcase.error ? true : false,
                    pending: options.skippedAsPending ? (testcase.skipped ? true : false) : false,
                    context: context ? JSON.stringify(context) : null,
                    code: null,
                    err: err,
                    uuid: uuid,
                    parentUUID: parentUUID,
                    isHook: false,
                    skipped: !options.skippedAsPending ? (testcase.skipped ? true : false) : false,
                };
                tests.push(test);
                if (test.fail) {
                    failures.push(uuid);
                }
                if (test.pass) {
                    passes.push(uuid);
                }
                if (test.pending || test.skipped) {
                    pending.push(uuid);
                }
            });
            let suiteFile = suite.file ? path.basename(suite.file.replaceAll('\\', '/')) : undefined;
            if (!suiteFile && suite.classname) {
                suiteFile = suite.classname;
            }
            this.suites.push({
                uuid: parentUUID,
                title: suite.name.replaceAll('Root Suite.', ''),
                fullFile: suite.file,
                file: suiteFile ?? '',
                beforeHooks: [],
                afterHooks: [],
                tests: tests,
                suites: [],
                passes: passes,
                failures: failures,
                pending: options.skippedAsPending ? pending : [],
                skipped: options.skippedAsPending ? [] : pending,
                duration: suite.time && Number(suite.time) !== 0 ? Math.ceil(Number(suite.time) * 1000) : suiteDuration,
                root: false,
                rootEmpty: false,
                _timeout: 10000,
            });
        });
    }
    /**
     * @param {ConverterOptions} options
     * @param {TestSuites} suitesRoot
     */
    async convert(options, suitesRoot) {
        if (!suitesRoot) {
            return;
        }
        const results = [];
        this.skippedTests = 0;
        this.failedTests = 0;
        this.suites = [];
        let pending = 0;
        let pendingPercent = 0;
        let suiteFailures = 0;
        const testSuites = suitesRoot.testsuite.filter((suite) => suite.tests !== '0');
        let duration = suitesRoot.time
            ? Number(suitesRoot.time)
            : _.sumBy(testSuites, function (suite) {
                return Number(suite.time);
            });
        if (duration === 0) {
            duration = _.sumBy(testSuites, (suite) => _.sumBy(suite.testcase, function (testCase) {
                return Number(testCase.time);
            }));
        }
        let tests = suitesRoot.tests
            ? Number(suitesRoot.tests)
            : _.sumBy(testSuites, function (suite) {
                return Number(suite.tests);
            });
        let avg = 0;
        if (tests !== 0) {
            avg = Math.ceil((duration * 1000) / tests);
        }
        this.parseTestSuites(options, testSuites, duration, avg);
        const name = suitesRoot.name;
        results.push({
            uuid: crypto.randomUUID(),
            title: name ?? '',
            fullFile: '',
            file: '',
            beforeHooks: [],
            afterHooks: [],
            tests: [],
            suites: this.suites,
            passes: [],
            failures: [],
            pending: [],
            skipped: [],
            duration: 0,
            root: true,
            rootEmpty: true,
            _timeout: 10000,
        });
        pending = suitesRoot.skipped ? Number(suitesRoot.skipped) : this.skippedTests;
        if (suitesRoot.failures) {
            suiteFailures += Number(suitesRoot.failures);
        }
        if (suitesRoot.errors) {
            suiteFailures += Number(suitesRoot.errors);
        }
        if (!suitesRoot.failures && !suitesRoot.errors) {
            suiteFailures = this.failedTests;
        }
        if (tests !== 0) {
            pendingPercent = (pending / tests) * 100;
        }
        const mochawesome = {
            stats: {
                suites: this.suites.length,
                tests: tests,
                passes: tests - suiteFailures - pending,
                pending: options.skippedAsPending ? pending : 0,
                failures: Number(suiteFailures),
                testsRegistered: tests,
                passPercent: Math.abs((suiteFailures / tests) * 100 - 100) - pendingPercent,
                pendingPercent: pendingPercent,
                other: 0,
                hasOther: false,
                skipped: !options.skippedAsPending ? pending : 0,
                hasSkipped: !options.skippedAsPending && pending > 0,
                duration: Math.ceil(duration * 1000),
            },
            results: results,
        };
        fs.writeFileSync(options.reportPath, JSON.stringify(mochawesome, null, 2), 'utf8');
        if (options.html) {
            const margeOptions = {
                reportFilename: options.htmlReportFile,
                reportDir: options.reportDir,
                showSkipped: true,
                reportTitle: path.basename(options.testFile),
            };
            (0, mochawesome_report_generator_1.create)(mochawesome, margeOptions).then(() => {
                // Report created
            });
        }
    }
}
exports.JsonProcessor = JsonProcessor;
const processor = new JsonProcessor();
const prepareJson = (options, json) => processor.prepareJson(options, json);
exports.prepareJson = prepareJson;
const convert = (options, suitesRoot) => processor.convert(options, suitesRoot);
exports.convert = convert;
//export default { prepareJson, convert };
//# sourceMappingURL=junit.js.map