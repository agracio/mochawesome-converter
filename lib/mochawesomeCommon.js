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
exports.MochawesomeCommon = void 0;
const fs = __importStar(require("fs"));
const crypto = __importStar(require("crypto"));
const mochawesome_report_generator_1 = require("mochawesome-report-generator");
class MochawesomeCommon {
    static createStats(suites, tests, passes = null, failures, pending, skipped, options, pendingPercent, other, duration) {
        return {
            suites: suites,
            tests: tests,
            passes: passes !== null ? passes : tests - failures - pending - skipped - other,
            pending: pending,
            failures: failures,
            testsRegistered: tests,
            passPercent: tests !== 0 ? Math.abs((failures / tests) * 100 - 100) - pendingPercent : 0,
            pendingPercent: pendingPercent,
            other: other,
            hasOther: other > 0,
            skipped: skipped,
            hasSkipped: skipped > 0,
            duration: duration,
        };
    }
    static createMargeReport(mochawesome, options) {
        fs.writeFileSync(options.reportPath, JSON.stringify(mochawesome, null, 2), 'utf8');
        if (options.html) {
            const margeOptions = {
                reportFilename: options.htmlReportFile,
                reportDir: options.reportDir,
                showSkipped: true,
                reportTitle: options.htmlReportTitle,
                charts: options.charts,
            };
            return (0, mochawesome_report_generator_1.create)(mochawesome, margeOptions);
        }
        else {
            return Promise.resolve();
        }
    }
    static createResult(id = null, title, suites) {
        return {
            uuid: id || crypto.randomUUID(),
            title: title,
            fullFile: '',
            file: '',
            beforeHooks: [],
            afterHooks: [],
            tests: [],
            suites: suites,
            passes: [],
            failures: [],
            pending: [],
            skipped: [],
            duration: 0,
            root: true,
            rootEmpty: true,
            _timeout: 10000,
        };
    }
    static sanitizeStackTrace(stackTrace) {
        return stackTrace
            .replace(/^[\r\n]+|[\r\n]+$/g, '')
            .replaceAll('                ', '')
            .replaceAll('            ', '')
            .replaceAll('\r\n   ', '\r\n')
            .replaceAll('\n   ', '\n');
    }
}
exports.MochawesomeCommon = MochawesomeCommon;
const common = new MochawesomeCommon();
//# sourceMappingURL=mochawesomeCommon.js.map