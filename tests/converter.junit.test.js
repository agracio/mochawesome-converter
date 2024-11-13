const fs = require("fs");

const test = require('@jest/globals').test;
const beforeAll = require('@jest/globals').beforeAll;
const afterAll = require('@jest/globals').afterAll;
const describe = require('@jest/globals').describe;

const converter = require('../src/converter');
const setup = require("./setup");

describe("JUnit converter tests", () => {

    const outDir= './tests/data/tmp';
    const reportDir= './tests/data/result';

    beforeAll(() => {
        setup.removeTempDir();
    });

    // afterAll(() => {
    //     setup.removeTempDir();
    // });

    test('convert junit-jenkins.xml', async() => {
        let options = setup.createOptions('junit-jenkins.xml', 'junit');

        await converter(options);
        setup.compare(options);
    });

    test('convert junit-notestsuites.xml', async() => {
        let options = setup.createOptions('junit-notestsuites.xml', 'junit');

        await converter(options);
        setup.compare(options, 'junit-jenkins-mochawesome.json');
    });

    test('convert junit-testsuites-noattributes.xml', async() => {
        let options = setup.createOptions('junit-testsuites-noattributes.xml', 'junit');

        await converter(options);
        setup.compare(options, 'junit-jenkins-mochawesome.json');
    });

    test('convert junit-mocha-xunit.xml', async() => {
        let options = setup.createOptions('junit-mocha-xunit.xml', 'junit')

        await converter(options);
        setup.compare(options);
    });

});