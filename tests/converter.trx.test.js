const test = require('@jest/globals').test;
const describe = require('@jest/globals').describe;

const common = require('./common');
const converter = require('../src/converter');

describe("TRX converter tests", () => {

    test('convert trx-mstest-datadriven.trx', async() => {
        let options = common.createOptions('trx-mstest-datadriven.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('convert trx-nunit-datadriven.trx', async() => {
        let options = common.createOptions('trx-nunit-datadriven.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('convert trx-xunit-datadriven.trx', async() => {
        let options = common.createOptions('trx-xunit-datadriven.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('convert trx-mstest-ignore.trx', async() => {
        let options = common.createOptions('trx-mstest-ignore.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('convert trx-nunit-ignore.trx', async() => {
        let options = common.createOptions('trx-nunit-ignore.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('convert trx-xunit-ignore.trx', async() => {
        let options = common.createOptions('trx-xunit-ignore.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('convert trx-mstest.trx', async() => {
        let options = common.createOptions('trx-mstest.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('convert trx-nunit.trx', async() => {
        let options = common.createOptions('trx-nunit.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('convert trx-xunit.trx', async() => {
        let options = common.createOptions('trx-xunit.trx', 'trx')
        await converter(options);
        common.compare(options, undefined, true);
    });

});