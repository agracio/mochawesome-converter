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

        if(options.saveIntermediateFiles){
            let parsed = path.parse(options.testFile);
            let fileName =  `${path.parse(options.testFile).name}-converted-junit.xml`;
            fs.writeFileSync(path.join(parsed.dir, fileName), xmlFormat(outXmlString))
        }
        let suitesRoot = junit.parseXml(options, outXmlString);
        junit.convert(options, suitesRoot);

    });
}
module.exports = convert;

