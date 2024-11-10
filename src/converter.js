const conf = require('./config');
const junit = require('./junit');
const xslt = require('./xslt');

/**
 * @param {ConverterOptions} config
 */
function xsltConverter(config) {
    xslt(config, `${config.testType}-junit.xslt`);
}

/**
 * Convert test report to mochawesome.
 *
 * @param {Options} options
 */
function converter(options){
    let config = conf.config(options);
    switch (config.testType) {
        case 'junit':
            junit.convert(config, null);
            break;
        case 'nunit':
        case 'xunit':
        case 'trx':
            xsltConverter(config);
            break;
    }
}

module.exports = converter;