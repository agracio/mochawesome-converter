const fs = require('fs');
const xmlFormat = require('xml-formatter');
const xsltProcessor = require('xslt-processor');
const path = require("path");
const junit = require('./junit');

/**
 * @param {ConverterOptions} options
 * @param {string} xsltFile
 */
function convert(options, xsltFile){

    let xsltString = fs.readFileSync(path.join(__dirname,xsltFile)).toString();

    let xmlString = fs.readFileSync(options.testFile).toString();

    const xslt = new xsltProcessor.Xslt();
    const xmlParser = new xsltProcessor.XmlParser();
    xslt.xsltProcess(
        xmlParser.xmlParse(xmlString),
        xmlParser.xmlParse(xsltString),
    ).then(outXmlString => {

        let parsedXml;

        if(options.saveIntermediateFiles){
            let fileName =  `${path.parse(options.testFile).name}-converted.xml`;
            fs.writeFileSync(path.join(options.reportDir, fileName), outXmlString)
        }

        try{
            parsedXml = xmlFormat(outXmlString)
        }
        catch (e) {
            throw `\nXml parsed from ${options.testFile} is invalid \n${e.message}`;
        }

        if(options.junit){
            fs.writeFileSync(path.join(options.reportDir, options.junitReportFilename), parsedXml)
        }

        let suitesRoot = junit.parseXml(options, parsedXml);

        junit.convert(options, suitesRoot);

    }).catch((e) => {
        throw `\nCould not parse Xml file ${options.testFile} using Xslt processor ${xsltFile} \n${e.message}`;
    });
}
module.exports = convert;

