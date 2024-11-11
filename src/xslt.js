const fs = require('fs');
const xmlFormat = require('xml-formatter');
const xsltProcessor = require('xslt-processor');
const path = require("path");
const junit = require('./junit');

/**
 * @param {ConverterOptions} options
 * @param {string} xmlString
 */

async function processXml(options, xmlString){
    let parsedXml;

    if(options.saveIntermediateFiles){
        let fileName =  `${path.parse(options.testFile).name}-converted.xml`;
        fs.writeFileSync(path.join(options.reportDir, fileName), xmlString, 'utf8');
    }

    try{
        parsedXml = xmlFormat(xmlString, {forceSelfClosingEmptyTag: true})
    }
    catch (e) {
        throw `\nXML parsed from ${options.testFile} is invalid \n${e.message}`;
    }

    if(options.junit){
        fs.writeFileSync(path.join(options.reportDir, options.junitReportFilename), parsedXml, 'utf8');
    }

    let suitesRoot = junit.parseXml(options, parsedXml);

    await junit.convert(options, suitesRoot);
}

/**
 * @param {ConverterOptions} options
 * @param {string} xsltFile
 */
async function convert(options, xsltFile){

    let xsltString = fs.readFileSync(path.join(__dirname,xsltFile)).toString();
    let xmlString = fs.readFileSync(options.testFile).toString();

    const xslt = new xsltProcessor.Xslt();
    const xmlParser = new xsltProcessor.XmlParser();
    let xml;
    try{
        xml = await xslt.xsltProcess(xmlParser.xmlParse(xmlString), xmlParser.xmlParse(xsltString));
    }
    catch (e) {
        throw `\nCould not process XML file ${xmlString} using XSLT ${xsltString} \n${e.message}`;
    }

    await processXml(options, xml);



    // ).then(outXmlString => {
    //     console.log('2---------------------------------------------------------------------');
    //     let parsedXml;
    //
    //     if(options.saveIntermediateFiles){
    //         let fileName =  `${path.parse(options.testFile).name}-converted.xml`;
    //         fs.writeFileSync(path.join(options.reportDir, fileName), outXmlString, 'utf8');
    //     }
    //
    //     try{
    //         parsedXml = xmlFormat(outXmlString, {forceSelfClosingEmptyTag: true})
    //     }
    //     catch (e) {
    //         throw `\nXml parsed from ${options.testFile} is invalid \n${e.message}`;
    //     }
    //
    //     if(options.junit){
    //         fs.writeFileSync(path.join(options.reportDir, options.junitReportFilename), parsedXml, 'utf8');
    //     }
    //
    //     let suitesRoot = junit.parseXml(options, parsedXml);
    //
    //     junit.convert(options, suitesRoot);
    //
    // });
    // console.log('3---------------------------------------------------------------------');
}
module.exports = convert;

