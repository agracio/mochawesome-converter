const fs = require("fs");

const test = require('@jest/globals').test;
const beforeAll = require('@jest/globals').beforeAll;
const afterAll = require('@jest/globals').afterAll;
const describe = require('@jest/globals').describe;

const setup = require('./setup');
const converter = require('../src/converter');

describe("TRX converter tests", () => {

    beforeAll(() => {
        setup.removeTempDir();
    });

    // afterAll(() => {
    //     setup.removeTempDir();
    // });

    test('convert trx-mstest-datadriven.trx', async() => {
        let options = setup.createOptions('trx-mstest-datadriven.trx', 'trx')
        await converter(options);
        setup.compare(options);
    });

    test('convert trx-nunit-datadriven.trx', async() => {
        let options = setup.createOptions('trx-nunit-datadriven.trx', 'trx')
        await converter(options);
        setup.compare(options);
    });

    test('convert trx-xunit-datadriven.trx', async() => {
        let options = setup.createOptions('trx-xunit-datadriven.trx', 'trx')
        await converter(options);
        setup.compare(options);
    });

    test('convert trx-mstest-ignore.trx', async() => {
        let options = setup.createOptions('trx-mstest-ignore.trx', 'trx')
        await converter(options);
        setup.compare(options);
    });

    test('convert trx-nunit-ignore.trx', async() => {
        let options = setup.createOptions('trx-nunit-ignore.trx', 'trx')
        await converter(options);
        setup.compare(options);
    });

    test('convert trx-xunit-ignore.trx', async() => {
        let options = setup.createOptions('trx-xunit-ignore.trx', 'trx')
        await converter(options);
        setup.compare(options);
    });

    test('convert trx-mstest.trx', async() => {
        let options = setup.createOptions('trx-mstest.trx', 'trx')
        await converter(options);
        setup.compare(options);
    });

    test('convert trx-nunit.trx', async() => {
        let options = setup.createOptions('trx-nunit.trx', 'trx')
        await converter(options);
        setup.compare(options);
    });

    test('convert trx-xunit.trx', async() => {
        let options = setup.createOptions('trx-xunit.trx', 'trx')
        await converter(options);
        setup.compare(options);
    });

});