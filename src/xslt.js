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
        throw `\nXML parsed from ${options.testFile} is empty or invalid \n${e.message}`;
    }

    if(options.junit && options.testType !== 'trx'){
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
    //console.log(`Processing ${options.testFile} using XSLT ${xsltFile}`);
    let xsltString = fs.readFileSync(path.join(__dirname, xsltFile)).toString();
    let xmlString = fs.readFileSync(options.testFile).toString();

    const xslt = new xsltProcessor.Xslt();
    const xmlParser = new xsltProcessor.XmlParser();
    let xml;
    try{
        xml = await xslt.xsltProcess(xmlParser.xmlParse(xmlString), xmlParser.xmlParse(xsltString));
    }
    catch (e) {
        throw `\nCould not process XML file ${options.testFile} using XSLT ${xsltFile} \n${e.message}`;
    }

    await processXml(options, xml);
}
module.exports = convert;

