const path = require('path');
const fs = require("fs");

const expect = require('@jest/globals').expect;
const test = require('@jest/globals').test;
const beforeAll = require('@jest/globals').beforeAll;
const afterAll = require('@jest/globals').afterAll;
const describe = require('@jest/globals').describe;

const converter = require('../src/converter');
const config = require('../src/config');

describe("TRX converter tests", () => {

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

    test('convert trx-mstest-datadriven.trx', async() => {
        let options = createOptions('trx-mstest-datadriven.trx', 'trx')
        await converter(options);
        await compare(options);
    });

    test('convert trx-nunit-datadriven.trx', async() => {
        let options = createOptions('trx-nunit-datadriven.trx', 'trx')
        await converter(options);
        await compare(options);
    });

    test('convert trx-xunit-datadriven.trx', async() => {
        let options = createOptions('trx-xunit-datadriven.trx', 'trx')
        await converter(options);
        await compare(options);
    });

});