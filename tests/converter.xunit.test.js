const test = require('@jest/globals').test;
const describe = require('@jest/globals').describe;

const converter = require('../src/converter');
const common = require('./common');

describe("xUnit.net converter tests", () => {

    test('convert xunit-sample.xml', async() => {
        let options = common.createOptions('xunit-sample.xml', 'xunit')
        await converter(options);
        common.compare(options, undefined, true);
    });

    test('convert xunit-qlnet.xml', async() => {
        let options = common.createOptions('xunit-qlnet.xml', 'xunit')
        await converter(options);
        common.compare(options, undefined, true);
    });

});