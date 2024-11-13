const fs = require("fs");

const test = require('@jest/globals').test;
const beforeAll = require('@jest/globals').beforeAll;
const afterAll = require('@jest/globals').afterAll;
const describe = require('@jest/globals').describe;

const converter = require('../src/converter');
const setup = require('./setup');

describe("xUnit.net converter tests", () => {

    beforeAll(() => {
        setup.removeTempDir();
    });

    // afterAll(() => {
    //     setup.removeTempDir();
    // });

    test('convert xunit-sample.xml', async() => {
        let options = setup.createOptions('xunit-sample.xml', 'xunit')
        await converter(options);
        setup.compare(options);
    });

    test('convert xunit-qlnet.xml', async() => {
        let options = setup.createOptions('xunit-qlnet.xml', 'xunit')
        await converter(options);
        setup.compare(options);
    });

});