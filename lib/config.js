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
exports.config = exports.ConfigService = exports.TestType = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
var TestType;
(function (TestType) {
    TestType["junit"] = "junit";
    TestType["nunit"] = "nunit";
    TestType["xunit"] = "xunit";
    TestType["trx"] = "trx";
    TestType["ctrf"] = "ctrf";
})(TestType || (exports.TestType = TestType = {}));
class ConfigService {
    static config(options) {
        if (!options) {
            throw new Error('options are required.');
        }
        if (!options.testFile) {
            throw new Error("Option 'testFile' is required.");
        }
        if (!fs.existsSync(options.testFile)) {
            throw new Error(`Could not find file ${options.testFile}.`);
        }
        const testFile = options.testFile;
        if (!options.testType) {
            throw new Error("Option 'testType' is required.");
        }
        if (!Object.values(TestType).includes(options.testType.toLowerCase())) {
            throw new Error(`Test type '${options.testType}' is not supported.`);
        }
        const testType = options.testType.toLowerCase();
        let skippedAsPending = true;
        let switchClassnameAndName = false;
        let reportDir = './report';
        let reportFile = `${path.parse(options.testFile).name}-mochawesome.json`;
        let html = true;
        let htmlReportFile = `${path.parse(options.testFile).name}-mochawesome.html`;
        let htmlReportTitle = path.basename(options.testFile);
        let saveIntermediateFiles = false;
        let splitByClassname = false;
        let junit = false;
        let junitReportFile = `${path.parse(options.testFile).name}-junit.xml`;
        let charts = false;
        if (options.skippedAsPending === false || options.skippedAsPending === 'false') {
            skippedAsPending = false;
        }
        if (options.switchClassnameAndName === true || options.switchClassnameAndName === 'true') {
            switchClassnameAndName = true;
        }
        if (options.html === true || options.html === 'true') {
            html = true;
        }
        if (options.html === false || options.html === 'false') {
            html = false;
        }
        if (options.saveIntermediateFiles === true || options.saveIntermediateFiles === 'true') {
            saveIntermediateFiles = true;
        }
        if (options.splitByClassname === true || options.splitByClassname === 'true') {
            splitByClassname = true;
        }
        if (options.charts === true || options.charts === 'true') {
            charts = true;
        }
        if (options.reportDir) {
            reportDir = options.reportDir;
        }
        if (options.reportFilename) {
            reportFile = options.reportFilename;
        }
        if (options.reportFile) {
            reportFile = options.reportFile;
        }
        if (options.htmlReportFilename) {
            htmlReportFile = options.htmlReportFilename;
        }
        if (options.htmlReportFile) {
            htmlReportFile = options.htmlReportFile;
        }
        if (options.htmlReportTitle) {
            htmlReportTitle = options.htmlReportTitle;
        }
        if (options.junit === true || options.junit === 'true') {
            junit = true;
        }
        if (options.junitReportFilename) {
            junitReportFile = options.junitReportFilename;
        }
        if (options.junitReportFile) {
            junitReportFile = options.junitReportFile;
        }
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }
        return {
            testFile: testFile,
            testType: testType,
            skippedAsPending: skippedAsPending,
            switchClassnameAndName: switchClassnameAndName,
            reportDir: reportDir,
            reportPath: path.join(reportDir, reportFile),
            junit: junit,
            junitReportFile: junitReportFile,
            html: html,
            htmlReportTitle: htmlReportTitle,
            htmlReportFile: htmlReportFile,
            splitByClassname: splitByClassname,
            saveIntermediateFiles: saveIntermediateFiles,
            charts: charts,
        };
    }
}
exports.ConfigService = ConfigService;
ConfigService.TestType = TestType;
exports.config = ConfigService.config;
//export default { config, TestType: ConfigService.TestType };
//# sourceMappingURL=config.js.map