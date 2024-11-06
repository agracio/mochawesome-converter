const fs = require('fs');
const path = require('path');
const parser = require('p3x-xml2json');
const crypto = require("crypto");
const marge = require('mochawesome-report-generator')

/**
 * @param {TestCase} testcase
 * @returns {ErrorMessage|{}}
 */
function getError(testcase){

    if(!testcase.failure && !testcase.error){
        return {};
    }
    let failure = testcase.failure ? testcase.failure : testcase.error
    let fail = failure[0];
    let prefix = fail.type ? `${fail.type}: ` : ''
    let diff = !fail.type || fail.type === 'Error' ? null : `${fail.message}`;
    let message = `${prefix}${fail.message}`;
    let estack = fail.$t;

    return {
        message: message,
        estack: estack,
        diff: diff
    };
}

/**
 * @param {TestCase} testcase
 */
function getContext(testcase){

    let context;

    if((testcase.skipped && testcase.skipped[0].message)
        || (testcase.properties && testcase.properties.length !== 0)
        || (testcase["system-out"] && testcase["system-out"].length !== 0)
        || (testcase["system-err"] && testcase["system-err"].length !== 0)){

        context = [];
        if(testcase.properties && testcase.properties.length !== 0){
            let properties = [];
            testcase.properties[0].property.forEach((property) => {
                properties.push(`${property.name}: ${property.value}`);
            });
            context.push(
                {
                    title: 'Properties',
                    value: properties
                }
            );
        }

        if(testcase.skipped && testcase.skipped[0].message){
            context.push(`skipped: ${testcase.skipped[0].message}`);
        }

        if(testcase["system-out"] && testcase["system-out"].length !== 0){
            context.push(
                {
                    title: 'system-out',
                    value: testcase["system-out"]
                }
            );
        }

        if(testcase["system-err"] && testcase["system-err"].length !== 0){
            context.push(
                {
                    title: 'system-err',
                    value: testcase["system-err"]
                }
            );
        }
    }
    return context;
}

/**
 * @param {ConverterOptions} options
 * @param {string|Buffer} xml
 * @returns {TestSuites}
 */
function parseXml(options, xml){

    let xmlParserOptions = {
        object: true,
        arrayNotation: true,
        sanitize: false,
    }

    let json;

    try{
        json = parser.toJson(xml, xmlParserOptions);
    }
    catch (e){
        throw `Could not convert xml file ${options.testFile} to valid json.\n ${e.message}`;
    }

    if(options.saveIntermediateFiles){
        let parsed = path.parse(options.testFile);
        let fileName =  `${path.parse(options.testFile).name}-converted-junit.json`;
        fs.writeFileSync(path.join(parsed.dir, fileName), JSON.stringify(json, null, 2))
    }

    if(!json || !json.testsuites || !json.testsuites.length){
        throw `Could not find valid testsuites element in ${options.testFile}`;
    }

    return json.testsuites[0];
}

/**
 * @param {ConverterOptions} options
 * @param {TestSuites} suitesRoot
 */
function convert(options, suitesRoot){

    if(!suitesRoot){
        suitesRoot = parseXml(options, fs.readFileSync(options.testFile));
    }

    // filter out empty test suites
    let testSuites = suitesRoot.testsuite.filter((suite) => suite.tests !== '0');

    let totalTests = 0;
    let results = [];
    let suites = [];

    let avg = Math.ceil(suitesRoot.time * 1000)/Number(suitesRoot.tests);
    let medium = Math.ceil(avg/2);

    testSuites.forEach((suite) => {
        totalTests += suite.testcase.length;
        let tests = [];
        let passes = [];
        let failures = [];
        let pending = [];

        let parentUUID = crypto.randomUUID();
        suite.testcase.forEach((testcase) => {

            let context = getContext(testcase);

            let uuid = crypto.randomUUID();
            let state = "passed";
            if(testcase.failure || testcase.error){
                state = "failed";
            }
            if(testcase.skipped){
                state = options.skippedAsPending ? "pending" : "skipped";
            }

            let speed = null;
            let duration = testcase.time ? Math.ceil(testcase.time * 1000) : 0;
            if(!testcase.skipped){
                if(suitesRoot.time && testcase.time){
                    if(duration >= avg){
                        speed = "slow";
                    }else if(duration >= medium){
                        speed = "medium";
                    }else{
                        speed = "fast";
                    }
                }
            }

            let test = {
                "title": options.switchClassnameAndName ? testcase.classname : testcase.name,
                "fullTitle": options.switchClassnameAndName ? testcase.name : testcase.classname,
                "duration": duration,
                "state": state,
                "speed": speed,
                "pass": !(testcase.failure || testcase.error || testcase.skipped),
                "fail": testcase.failure || testcase.error ? true : false,
                "pending": options.skippedAsPending ? testcase.skipped ? true : false : false,
                "context": context ? JSON.stringify(context) : null,
                "code": null,
                "err": getError(testcase),
                "uuid": uuid,
                "parentUUID": parentUUID,
                "isHook": false,
                "skipped": !options.skippedAsPending ? testcase.skipped ? true : false : false,
            }

            tests.push(test);

            if(test.fail){failures.push(uuid);}

            if(test.pass){passes.push(uuid);}

            if(test.pending || test.skipped){pending.push(uuid);}
        });

        suites.push({
            "uuid": parentUUID,
            "title": suite.name,
            "fullFile": suite.file,
            "file": suite.file ? path.basename(suite.file) : "",
            "beforeHooks": [],
            "afterHooks": [],
            "tests": tests,
            "suites": [],
            "passes": passes,
            "failures": failures,
            "pending": options.skippedAsPending ? pending : [],
            "skipped": options.skippedAsPending ? [] : pending,
            "duration": suite.time ? Math.ceil(suite.time * 1000) : 0,
            "root": false,
            "rootEmpty": false,
            "_timeout": 10000
        });

    });

    results.push(
        {
            "uuid": crypto.randomUUID(),
            "title": suitesRoot.name ?? '' ,
            "fullFile": "",
            "file": "",
            "beforeHooks": [],
            "afterHooks": [],
            "tests": [],
            "suites": suites,
            "passes": [],
            "failures": [],
            "pending": [],
            "skipped": [],
            "duration": 0,
            "root": true,
            "rootEmpty": true,
            "_timeout": 10000
        }
    );

    let skipped = suitesRoot.skipped
    let pending = skipped ? Number(skipped) : suitesRoot.tests - totalTests;
    let pendingPercent = (pending/suitesRoot.tests*100);

    let mochawesome = {
        "stats": {
            "suites": suites.length,
            "tests": Number(suitesRoot.tests),
            "passes": totalTests - suitesRoot.failures - pending,
            "pending": options.skippedAsPending ? pending : 0,
            "failures": Number(suitesRoot.failures),
            "testsRegistered": Number(suitesRoot.tests),
            "passPercent": Math.abs((suitesRoot.failures/totalTests*100)-100) - pendingPercent,
            "pendingPercent": pendingPercent,
            "other": 0,
            "hasOther": false,
            "skipped": !options.skippedAsPending ? pending : 0,
            "hasSkipped": !options.skippedAsPending && pending > 0,
            "duration": suitesRoot.time? Math.ceil(suitesRoot.time * 1000) : 0,
        },
        "results": results
    }

    fs.writeFileSync(options.reportPath, JSON.stringify(mochawesome, null, 2))

    if(options.html){
        const margeOptions = {
            reportFilename: options.htmlReportFilename,
            reportDir: options.htmlReportDir,
            showSkipped: true,
        }

        marge.create(mochawesome, margeOptions).then(() => {
            //console.log(`Mochawesome report created: ${margeOptions.reportDir}/${margeOptions.reportFilename}`)
        })
    }


}

module.exports = {
    convert,
    parseXml
};