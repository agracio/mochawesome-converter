const path = require('path');
const fs = require("fs");

const expect = require('@jest/globals').expect;
const test = require('@jest/globals').test;
const beforeAll = require('@jest/globals').beforeAll;
const afterAll = require('@jest/globals').afterAll;
const describe = require('@jest/globals').describe;

const margeConvert = require('../src/converter');
const config = require('../src/config');

describe("JUnit converter tests", () => {

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
        }
    }

    /**
     * @param {TestReportConverterOptions} options
     */
    function compare(options){
        let createdReport = fs.readFileSync(path.join(outDir, options.reportFilename), 'utf8');
        let report = fs.readFileSync(path.join(reportDir, options.reportFilename), 'utf8');

        expect(createdReport.replaceAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,'')).toBe(report.replaceAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,''));
    }

    test('convert junit-jenkins.xml', async() => {
        let options = createOptions('junit-jenkins.xml', 'junit')

        await margeConvert(options);
        compare(options);
    });


});