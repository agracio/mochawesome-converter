const path = require('path');
const fs = require('fs');

const TestType = {
  junit: 'junit',
  nunit: 'nunit',
  xunit: 'xunit',
};

/**
 * @returns {ConverterOptions} options
 */
module.exports = function (options) {
    
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
  let reportDir = '';
  let reportFilename = 'mochawesome.json';
  let html = false;
  let htmlReportDir = '';
  let htmlReportFilename = 'mochawesome.html';
  let saveIntermediateFiles = false;

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

   if(options.htmlReportDir){
    htmlReportDir = options.htmlReportDir;
  }

  if(options.htmlReportFilename){
    htmlReportFilename = options.htmlReportFilename;
  }

  return{
    testFile: testFile,
    testType: testType,
    skippedAsPending: skippedAsPending,
    switchClassnameAndName: switchClassnameAndName,
    reportPath: path.join(reportDir, reportFilename),
    saveIntermediateFiles: saveIntermediateFiles,
    html: html,
    htmlReportDir: htmlReportDir,
    htmlReportFilename: htmlReportFilename
  }
};