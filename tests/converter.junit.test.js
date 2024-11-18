const test = require('@jest/globals').test;
const describe = require('@jest/globals').describe;

const converter = require('../src/converter');
const common = require("./common");

describe("JUnit converter tests", () => {

    test('convert junit-jenkins.xml', async() => {
        let options = common.createOptions('junit-jenkins.xml', 'junit');

        await converter(options);
        common.compare(options);
    });

    test('convert junit-notestsuites.xml', async() => {
        let options = common.createOptions('junit-notestsuites.xml', 'junit');

        await converter(options);
        common.compare(options, 'junit-jenkins-mochawesome.json');
    });

    test('convert junit-testsuites-noattributes.xml', async() => {
        let options = common.createOptions('junit-testsuites-noattributes.xml', 'junit');

        await converter(options);
        common.compare(options, 'junit-jenkins-mochawesome.json');
    });

    test('convert junit-mocha-xunit.xml', async() => {
        let options = common.createOptions('junit-mocha-xunit.xml', 'junit')

        await converter(options);
        common.compare(options);
    });

});