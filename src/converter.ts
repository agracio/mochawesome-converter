import { toFile, toJson, TestSuites as JunitReport } from 'junit-converter';
import { config } from './config';
import { convert as junitConvert } from './junitConverter';
import { convert as ctrfConvert } from './ctrfConverter';
import { TestReportConverterOptions, ConverterOptions } from './interfaces';

export class TestReportConverter {

    static async convert(options: TestReportConverterOptions): Promise<void> {

        const configOptions: ConverterOptions = config(options);
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
                await toFile(junitConvertOptions);
            }
            const json: JunitReport = await toJson(junitConvertOptions);
            await junitConvert(configOptions, json);
        } else {
            await ctrfConvert(configOptions);
        }
    }
}

module.exports = TestReportConverter.convert;