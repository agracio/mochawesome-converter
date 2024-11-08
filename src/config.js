const path = require('path');
const fs = require('fs');

const TestType = {
  junit: 'junit',
  nunit: 'nunit',
  xunit: 'xunit',
  trx: 'trx'
};

/**
 * @returns {ConverterOptions} options
 */
function config (options) {
    
  if(!options.testFile) {
    throw "Option 'testFile' is required.";
  }
  if(!fs.existsSync(options.testFile)) {
    throw `Could not find file ${options.testFile}.`;
  }

  let testFile = options.testFile;

  if(!options.testType){
    throw "Option 'testType' is required.";
  }
  if(!TestType.hasOwnProperty(options.testType.toLowerCase())){
    throw `Test type '${options.testType}' is not supported.`;
  }

  let testType = options.testType.toLowerCase();

  let skippedAsPending = true;
  let switchClassnameAndName = false;
  let reportDir = './report';
  let reportFilename = 'mochawesome.json';
  let html = false;
  let htmlReportFilename = 'mochawesome.html';
  let saveIntermediateFiles = false;
  let junit = false;
  let junitReportFilename = `${path.parse(options.testFile).name}-junit.xml`;

  if(options.skippedAsPending === false || options.skippedAsPending === 'false'){
    skippedAsPending = false;
  }

  if(options.switchClassnameAndName === true || options.switchClassnameAndName === 'true'){
    switchClassnameAndName = true;
  }

  if(options.html === true || options.html === 'true'){
    html = true;
  }

  if(options.saveIntermediateFiles === true || options.saveIntermediateFiles === 'true'){
    saveIntermediateFiles = true;
  }

  if(options.reportDir){
    reportDir = options.reportDir;
  }

  if(options.reportFilename){
    reportFilename = options.reportFilename;
  }

  if(options.htmlReportFilename){
    htmlReportFilename = options.htmlReportFilename;
  }

  if(options.junit === true || options.junit === 'true'){
    junit = true;
  }

  if(!fs.existsSync(reportDir)){
    fs.mkdirSync(reportDir);
  }

  return{
    testFile: testFile,
    testType: testType,
    skippedAsPending: skippedAsPending,
    switchClassnameAndName: switchClassnameAndName,
    reportDir: reportDir,
    reportPath: path.join(reportDir, reportFilename),
    saveIntermediateFiles: saveIntermediateFiles,
    junit: junit,
    junitReportFilename: junitReportFilename,
    html: html,
    htmlReportFilename: htmlReportFilename
  }
}

module.exports = {config, TestType}