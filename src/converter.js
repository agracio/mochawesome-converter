const conf = require('./config');
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
    await xsltConverter(config);
}

module.exports = convert;