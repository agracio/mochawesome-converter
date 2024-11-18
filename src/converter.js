const conf = require('./config');
const junit = require('./junit');
const xslt = require('./xslt');

/**
 * @param {ConverterOptions} config
 */
async function xsltConverter(config) {
    await xslt(config, `${config.testType}-junit.xslt`);
}

/**
 * Convert test report to mochawesome.
 *
 * @param {TestReportConverterOptions} options
 */
async function convert(options){

    let config = conf.config(options);

    //console.log(`Converting file ${options.testFile} using '${options.testType}' converter.`);

    switch (config.testType) {
        case 'junit':
            await junit.convert(config, null);
            break;
        case 'nunit':
        case 'xunit':
        case 'trx':
            await xsltConverter(config);
            break;
    }
}

module.exports = convert;