const path = require('path');
const fs = require("fs");

const expect = require('@jest/globals').expect;
const test = require('@jest/globals').test;
const beforeAll = require('@jest/globals').beforeAll;
const afterAll = require('@jest/globals').afterAll;
const describe = require('@jest/globals').describe;
const Options = require('../');

const margeConvert = require('../src/converter');
const config = require('../src/config');

describe.skip("xUnit.net converter tests", () => {

    const outDir= './tests/data/tmp';
    const reportDir= './tests/data/result';

    beforeAll(() => {
        if(fs.existsSync(outDir)){
            fs.rmSync(outDir, { recursive: true, force: true });
        }
    });

    // afterAll(() => {
    //     if(fs.existsSync(outDir)){
    //         fs.rmSync(outDir, { recursive: true, force: true });
    //     }
    // });

    function getFilename(file){
        return `${path.parse(file).name}-mochawesome.json`
    }

    /**
     * @returns {TestReportConverterOptions} options
     */
    function createOptions(file, type){
        return {
            testFile: path.join(__dirname, `data/source/${file}`),
            testType: type,
            reportDir: outDir,
            reportFilename: getFilename(file),
            junit: true
        }
    }

    /**
     * @param {TestReportConverterOptions} options
     */
    async function compare(options){
        let createdReport = fs.readFileSync(path.join(outDir, options.reportFilename), 'utf8');
        let report = fs.readFileSync(path.join(reportDir, options.reportFilename), 'utf8');

        await expect(createdReport.replaceAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,'')).toBe(report.replaceAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,''));
    }

    test('convert xunit-sample.xml', async() => {
        let options = createOptions('xunit-sample.xml', 'xunit')
        await margeConvert(options);
        await compare(options);
    });

    test('convert xunit-qlnet.xml', async() => {
        let options = createOptions('xunit-qlnet.xml', 'xunit')
        await margeConvert(options);
        await compare(options);
    });

});