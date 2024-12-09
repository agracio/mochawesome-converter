const test = require('@jest/globals').test;
const describe = require('@jest/globals').describe;

const converter = require('../src/converter');
const common = require('./common');

describe("NUnit converter tests", () => {

    test('nunit-sample.xml', async() => {
        let options = common.createOptions('nunit-sample.xml', 'nunit')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('nunit-short.xml', async() => {
        let options = common.createOptions('nunit-short.xml', 'nunit')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('nunit-mudblazor.xml', async() => {
        let options = common.createOptions('nunit-mudblazor.xml', 'nunit')
        await converter(options);
        common.compare(options, undefined, true);
    });

});