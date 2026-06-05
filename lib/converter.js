"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestReportConverter = void 0;
const junit_converter_1 = require("junit-converter");
const config_1 = require("./config");
const junitConverter_1 = require("./junitConverter");
const ctrfConverter_1 = require("./ctrfConverter");
class TestReportConverter {
    static async convert(options) {
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
        if (configOptions.testType !== 'ctrf') {
            if (options.junit) {
                await (0, junit_converter_1.toFile)(junitConvertOptions);
            }
            const json = await (0, junit_converter_1.toJson)(junitConvertOptions);
            await (0, junitConverter_1.convert)(configOptions, json);
        }
        else {
            await (0, ctrfConverter_1.convert)(configOptions);
        }
    }
}
exports.TestReportConverter = TestReportConverter;
module.exports = TestReportConverter.convert;
//# sourceMappingURL=converter.js.map