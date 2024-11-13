const path = require('path');
const fs = require("fs");
const expect = require('@jest/globals').expect;

const reportDir= './tests/data/result';
const outDir= './tests/data/tmp';

function removeTempDir(){
    if(fs.existsSync(outDir)){
        fs.rmSync(outDir, { recursive: true, force: true });
    }
}

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
 * @param {string?} reportFilename
 */
function compare(options, reportFilename){
    let createdReport = fs.readFileSync(path.join(outDir, options.reportFilename), 'utf8');
    let report = fs.readFileSync(path.join(reportDir, reportFilename ?? options.reportFilename), 'utf8');

    expect(createdReport.replaceAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,'')).toBe(report.replaceAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,''));
}

exports.outDir = outDir;
exports.createOptions = createOptions;
exports.compare = compare;
exports.removeTempDir = removeTempDir;
