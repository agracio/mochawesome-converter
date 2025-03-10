const path = require('path');
const fs = require("fs");
//const expect = require('@jest/globals').expect;

const reportDir= './tests/data/result';
const outDir= './tests/data/tmp';

function removeTempDir(){
    if(fs.existsSync(outDir)){
        fs.rmSync(outDir, { recursive: true, force: true });
    }
}

/**
 * @returns {TestReportConverterOptions}
 */
function createOptions(file, type, saveIntermediateFiles){
    if(!saveIntermediateFiles){
        saveIntermediateFiles = false;
    }
    return {
        testFile: path.join(__dirname, `data/source/${file}`),
        testType: type,
        reportDir: outDir,
        reportFilename:`${path.parse(file).name}-mochawesome.json`,
        junit: true,
        junitReportFilename: `${path.parse(file).name}-junit.xml`,
        saveIntermediateFiles: saveIntermediateFiles,
    }
}

/**
 * @param {TestReportConverterOptions} options
 * @param {string?} reportFilename
 * @param {Boolean?} compareJunit
 * @param {Boolean?} checkIntermediateFiles
 */
function compare(options, reportFilename, compareJunit, checkIntermediateFiles){

    let createdReport = fs.readFileSync(path.join(outDir, reportFilename ?? options.reportFilename), 'utf8').replaceAll('\r', '');
    let report = fs.readFileSync(path.join(reportDir, reportFilename ?? options.reportFilename), 'utf8').replaceAll('\r', '') ;

    expect(createdReport.replaceAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,'')).toBe(report.replaceAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,''));

    if(compareJunit){
        let junitCreatedReport = fs.readFileSync(path.join(outDir, options.junitReportFilename), 'utf8').replaceAll('\r', '');
        let junitReport = fs.readFileSync(path.join(reportDir, options.junitReportFilename), 'utf8').replaceAll('\r', '');

        expect(junitCreatedReport).toBe(junitReport);
    }

    if(checkIntermediateFiles){
        expect(fs.existsSync(path.join(outDir, `${path.parse(options.testFile).name}-converted.xml`))).toBe(true);
        expect(fs.existsSync(path.join(outDir, `${path.parse(options.testFile).name}-converted.json`))).toBe(true);
    }
}

exports.outDir = outDir;
exports.createOptions = createOptions;
exports.compare = compare;
exports.removeTempDir = removeTempDir;
