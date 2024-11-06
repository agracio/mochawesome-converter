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
function convert(options){
    let config = conf(options);
    switch (config.testType) {
        case 'junit':
            junit.convert(config, null);
            break;
        case 'nunit':
            xsltConverter(config);
            break;
        case 'xunit':
            xsltConverter(config);
            break;
    }
}

module.exports = {convert};