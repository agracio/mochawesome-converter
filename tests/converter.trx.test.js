const test = require('@jest/globals').test;
const describe = require('@jest/globals').describe;

const common = require('./common');
const converter = require('../src/converter');

describe("TRX converter tests", () => {

    test('trx-mstest-datadriven.trx', async() => {
        let options = common.createOptions('trx-mstest-datadriven.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('trx-nunit-datadriven.trx', async() => {
        let options = common.createOptions('trx-nunit-datadriven.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('trx-xunit-datadriven.trx', async() => {
        let options = common.createOptions('trx-xunit-datadriven.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('trx-mstest-ignore.trx', async() => {
        let options = common.createOptions('trx-mstest-ignore.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('trx-nunit-ignore.trx', async() => {
        let options = common.createOptions('trx-nunit-ignore.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('trx-xunit-ignore.trx', async() => {
        let options = common.createOptions('trx-xunit-ignore.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('trx-mstest.trx', async() => {
        let options = common.createOptions('trx-mstest.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('trx-nunit.trx', async() => {
        let options = common.createOptions('trx-nunit.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('trx-xunit.trx', async() => {
        let options = common.createOptions('trx-xunit.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('trx-sample.trx', async() => {
        let options = common.createOptions('trx-sample.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('trx-properties.trx', async() => {
        let options = common.createOptions('trx-properties.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

});