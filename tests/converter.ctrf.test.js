const test = require('@jest/globals').test;
const describe = require('@jest/globals').describe;

const converter = require('../lib/converter');
const common = require("./common");

describe("CTRF converter tests", () => {

    test('fails with incorrect type', async() => {
        let options = common.createOptions('ctrf-comprehensive.json', 'nunit');

        try {
            await converter(options);
        } catch (error) {
            expect(error.message.replaceAll('\n', '')).toMatch(/is empty or invalid Failed to parse XML/);
        }

    });

     test('fails with incorrect file', async() => {
        let options = common.createOptions('junit-notestsuites.xml', 'ctrf');

        try {
            await converter(options);
        } catch (error) {
            expect(error.message.replaceAll('\n', '')).toMatch(/SyntaxError: Unexpected token '<'/);
        }

    });

     test('fails with missing file', async() => {
        let options = common.createOptions('missing-file.json', 'ctrf');

        try {
            await converter(options);
        } catch (error) {
            expect(error.message.replaceAll('\n', '')).toMatch(/Could not find file/);
        }

    });

    test('ctrf-comprehensive.json', async() => {
        let options = common.createOptions('ctrf-comprehensive.json', 'ctrf');

        await converter(options);
        common.compare(options, undefined, false);
    });

    test('ctrf-minimal.json', async() => {
        let options = common.createOptions('ctrf-minimal.json', 'ctrf');

        await converter(options);
        common.compare(options, undefined, false);
    });

    test('ctrf-with-diagnostics.json', async() => {
        let options = common.createOptions('ctrf-with-diagnostics.json', 'ctrf');

        await converter(options);
        common.compare(options, undefined, false);
    });

    test('ctrf-with-insights.json', async() => {
        let options = common.createOptions('ctrf-with-insights.json', 'ctrf');

        await converter(options);
        common.compare(options, undefined, false);

    });

    test('ctrf-with-retries.json', async() => {
        let options = common.createOptions('ctrf-with-retries.json', 'ctrf');

        await converter(options);
        common.compare(options, undefined, false);
    });
});