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
 * @param {TestReportConverterOptions} options
 * @param {string?} reportFilename
 * @param {Boolean?} compareJunit
 */
function compare(options, reportFilename, compareJunit){

    //createCompareFiles(options, reportFilename, compareJunit);

    let createdReport = fs.readFileSync(path.join(outDir, reportFilename ?? options.reportFilename), 'utf8');
    createdReport = JSON.parse( JSON.stringify( createdReport ) )

    let report = fs.readFileSync(path.join(reportDir, reportFilename ?? options.reportFilename), 'utf8');
    report = JSON.parse( JSON.stringify( report ) )

    expect(createdReport.replaceAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,'')).toBe(report.replaceAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,''));

    if(compareJunit){
        let junitCreatedReport = fs.readFileSync(path.join(outDir, options.junitReportFilename), 'utf8');
        junitCreatedReport = JSON.parse( JSON.stringify( junitCreatedReport ) )
        let junitReport = fs.readFileSync(path.join(reportDir, options.junitReportFilename), 'utf8');
        junitReport = JSON.parse( JSON.stringify( junitReport ) )

        expect(junitCreatedReport).toBe(junitReport);
    }
}

exports.outDir = outDir;
exports.createOptions = createOptions;
exports.compare = compare;
exports.removeTempDir = removeTempDir;
