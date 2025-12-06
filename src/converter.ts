import { toFile, toJson } from 'junit-converter';
import { config } from './config';
import { prepareJson, convert as junitConvert } from './junit';
import { TestReportConverterOptions, ConverterOptions } from './interfaces';

/**
 * Convert test report to mochawesome.
 *
 * @param {TestReportConverterOptions} options
 */
async function convert(options: TestReportConverterOptions): Promise<void> {
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

    if (options.junit) {
        await toFile(junitConvertOptions);
    }
    const json = await toJson(junitConvertOptions);

    const suitesRoot = prepareJson(configOptions, json);

    await junitConvert(configOptions, suitesRoot);
}

module.exports = convert;

