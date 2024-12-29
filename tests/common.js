const path = require('path');
const fs = require("fs");
//const expect = require('@jest/globals').expect;

const reportDir= './tests/data/result';
const outDir= './tests/data/tmp';
const outDirWrite= './tests/data/tmpWrite';
const compareDir = './tests/data/compare';

function removeTempDir(){
    if(fs.existsSync(outDir)){
        fs.rmSync(outDir, { recursive: true, force: true });
    }
    if(fs.existsSync(compareDir)){
        fs.rmSync(compareDir, { recursive: true, force: true });
    }
    if(fs.existsSync(outDirWrite)){
        fs.rmSync(outDirWrite, { recursive: true, force: true });
    }
}

/**
 * @returns {TestReportConverterOptions}
 */
function createOptions(file, type){
    return {
        testFile: path.join(__dirname, `data/source/${file}`),
        testType: type,
        reportDir: outDir,
        reportFilename:`${path.parse(file).name}-mochawesome.json`,
        junit: true,
        transformJunit: true,
        junitReportFilename: `${path.parse(file).name}-junit.xml`,
    }
}

/**
 * Re-writing compare for test system compatibility
 * @param {TestReportConverterOptions} options
 * @param {string?} reportFilename
 * @param {Boolean?} compareJunit
 */
function createCompareFiles(options, reportFilename, compareJunit){

    if(!fs.existsSync(compareDir)){
        fs.mkdirSync(compareDir);
    }
    if(!fs.existsSync(outDirWrite)){
        fs.mkdirSync(outDirWrite);
    }

    let report = fs.readFileSync(path.join(reportDir, reportFilename ?? options.reportFilename), 'utf8');
    fs.writeFileSync(path.join(compareDir, reportFilename ?? options.reportFilename), report, 'utf8')

    if(compareJunit){
        let junitReport = fs.readFileSync(path.join(reportDir, options.junitReportFilename), 'utf8');
        fs.writeFileSync(path.join(compareDir, options.junitReportFilename), junitReport, 'utf8')
    }
}

/**
 * @param {TestReportConverterOptions} options
 * @param {string?} reportFilename
 * @param {Boolean?} compareJunit
 */
function compare(options, reportFilename, compareJunit){

    createCompareFiles(options, reportFilename, compareJunit);

    // rewrite compare files for test system compatibility

    let createdReport = fs.readFileSync(path.join(outDir, reportFilename ?? options.reportFilename), 'utf8');
    fs.writeFileSync(path.join(outDirWrite, reportFilename ?? options.reportFilename), createdReport, 'utf8');
    let testMochaReport = fs.readFileSync(path.join(outDirWrite, reportFilename ?? options.reportFilename), 'utf8');

    let report = fs.readFileSync(path.join(compareDir, reportFilename ?? options.reportFilename), 'utf8');

    expect(testMochaReport.replaceAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,'')).toBe(report.replaceAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,''));

    if(compareJunit){
        let junitCreatedReport = fs.readFileSync(path.join(outDir, options.junitReportFilename), 'utf8');
        fs.writeFileSync(path.join(outDirWrite, options.junitReportFilename), junitCreatedReport, 'utf8');
        let testReport = fs.readFileSync(path.join(outDirWrite, options.junitReportFilename), 'utf8');
        let junitReport = fs.readFileSync(path.join(compareDir, options.junitReportFilename), 'utf8');

        expect(testReport).toBe(junitReport);
    }
}

exports.outDir = outDir;
exports.compareDir = compareDir;
exports.createOptions = createOptions;
exports.compare = compare;
exports.removeTempDir = removeTempDir;
