'use strict';
const junitConvert = require('junit-converter');
const conf = require('./config');
const junit = require('./junit');

/**
 * Convert test report to mochawesome.
 *
 * @param {TestReportConverterOptions} options
 */
async function convert(options){

    let config = conf.config(options);
    let junitConvertOptions = {
        testFile: config.testFile,
        testType: config.testType,
        switchClassnameAndName: config.switchClassnameAndName,
        reportDir: config.reportDir,
        reportFilename: config.junitReportFilename,
        splitByClassname: config.splitByClassname || config.testType === 'trx',
        saveIntermediateFiles: config.saveIntermediateFiles,
    };

    if(options.junit){
        await junitConvert.toFile(junitConvertOptions);
    }
    const json = await junitConvert.toJson(junitConvertOptions);

    let suitesRoot = junit.prepareJson(config, json)

    await junit.convert(config, suitesRoot);
}

module.exports = convert;