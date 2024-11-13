const fs = require("fs");

const test = require('@jest/globals').test;
const beforeAll = require('@jest/globals').beforeAll;
const afterAll = require('@jest/globals').afterAll;
const describe = require('@jest/globals').describe;

const converter = require('../src/converter');
const setup = require('./setup');

describe("NUnit converter tests", () => {

    beforeAll(() => {
        setup.removeTempDir();
    });

    // afterAll(() => {
    //     setup.removeTempDir();
    // });

    test('convert nunit-sample.xml', async() => {
        let options = setup.createOptions('nunit-sample.xml', 'nunit')
        await converter(options);
        setup.compare(options);
    });

    test('convert nunit-short.xml', async() => {
        let options = setup.createOptions('nunit-short.xml', 'nunit')
        await converter(options);
        setup.compare(options);
    });

    test('convert nunit-mudblazor.xml', async() => {
        let options = setup.createOptions('nunit-mudblazor.xml', 'nunit')
        await converter(options);
        setup.compare(options);
    });

});