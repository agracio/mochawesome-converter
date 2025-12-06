"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const junit_converter_1 = require("junit-converter");
const config_1 = require("./config");
const junit_1 = require("./junit");
/**
 * Convert test report to mochawesome.
 *
 * @param {TestReportConverterOptions} options
 */
async function convert(options) {
    const configOptions = (0, config_1.config)(options);
    const junitConvertOptions = {
        testFile: configOptions.testFile,
        testType: configOptions.testType,
        switchClassnameAndName: configOptions.switchClassnameAndName,
        reportDir: configOptions.reportDir,
        reportFile: configOptions.junitReportFile,
        splitByClassname: configOptions.splitByClassname || configOptions.testType === 'trx',
        saveIntermediateFiles: configOptions.saveIntermediateFiles,
    };
    if (options.junit) {
        await (0, junit_converter_1.toFile)(junitConvertOptions);
    }
    const json = await (0, junit_converter_1.toJson)(junitConvertOptions);
    const suitesRoot = (0, junit_1.prepareJson)(configOptions, json);
    await (0, junit_1.convert)(configOptions, suitesRoot);
}
module.exports = convert;
//# sourceMappingURL=converter.js.map