const fs = require('fs');
const path = require('path');
const parser = require('p3x-xml2json');
const crypto = require("crypto");
const marge = require('mochawesome-report-generator');
const firstBy = require('thenby').firstBy;

let totalTests = 0;
let suites = [];
let suiteTests = 0;
let pending = 0;
let pendingPercent = 0;
let suiteTime = 0;
let suiteFailures = 0;
let testTimes = 0;

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
        || (testcase.properties && testcase.properties.length !== 0 && testcase.properties[0].property)
        || (testcase["system-out"] && testcase["system-out"].length !== 0)
        || (testcase["system-err"] && testcase["system-err"].length !== 0)){

        context = [];
        let skipped = '';

        if(testcase.properties && testcase.properties.length !== 0 && testcase.properties[0].property){
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
            skipped = testcase.skipped[0].message;
            context.push(`skipped: ${testcase.skipped[0].message}`);
        }

        if(testcase["system-out"] && testcase["system-out"].length !== 0){
            if(testcase["system-out"][0] !== skipped){
                context.push(
                    {
                        title: 'system-out',
                        value: testcase["system-out"][0]
                    }
                );
            }
        }

        if(testcase["system-err"] && testcase["system-err"].length !== 0){
            context.push(
                {
                    title: 'system-err',
                    value: testcase["system-err"][0]
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
        throw `\nCould not read JSON from converted input ${options.testFile}.\n ${e.message}`;
    }

    if(!json || !json.testsuites || !json.testsuites.length){
        throw `\nCould not find valid <testsuites> element in converted ${options.testFile}`;
    }

    if(!json.testsuites[0].testsuite){
        throw `\nNo <testsuite> elements in <testsuites> element in converted ${options.testFile}`;
    }

    // sort test suites
    if(json.testsuites[0].testsuite[0].file && testSuites[i].testsuite[0].classname){
        json.testsuites[0].testsuite.sort(
            firstBy('file', {ignoreCase:true})
                .thenBy('classname', {ignoreCase:true})
                .thenBy('name', {ignoreCase:true})
        );
    }
    else if(json.testsuites[0].testsuite[0].classname){
        json.testsuites[0].testsuite.sort(
            firstBy('classname', {ignoreCase:true})
                .thenBy('name', {ignoreCase:true})
        );
    }
    else{
        json.testsuites[0].testsuite.sort(firstBy('name', {ignoreCase:true}));
    }

    if(options.saveIntermediateFiles){
        let fileName = `${path.parse(options.testFile).name}-converted.json`;
        fs.writeFileSync(path.join(options.reportDir, fileName), JSON.stringify(json, null, 2), 'utf8')
    }

    return json.testsuites[0];
}

/**
 * @param {ConverterOptions} options
 * @param {[TestSuite]} testSuites
 * @param {Number} totalSuitTime
 * @param {Number} avgSuitTime
 */

function parseTestSuites(options, testSuites, totalSuitTime, avgSuitTime){

    let mediumTime = Math.ceil(avgSuitTime/2);

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
                if(totalSuitTime && totalSuitTime !==0 && testcase.time){
                    if(duration >= avgSuitTime){
                        speed = "slow";
                    }else if(duration >= mediumTime){
                        speed = "medium";
                    }else{
                        speed = "fast";
                    }
                }
            }

            if(testcase.time){
                testTimes += Number(testcase.time);
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

        let suiteFile = suite.file ? path.basename(suite.file) : undefined
        if(!suiteFile && suite.classname){suiteFile = suite.classname; }

        suites.push({
            "uuid": parentUUID,
            "title": suite.name,
            "fullFile": suite.file,
            "file": suiteFile ?? '',
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
}

/**
 * @param {ConverterOptions} options
 * @param {TestSuites} suitesRoot
 */
async function convert(options, suitesRoot){

    let results = [];

    totalTests = 0;
    suites = [];
    suiteTests = 0;
    pending = 0;
    pendingPercent = 0;
    suiteTime = 0;
    suiteFailures = 0;
    testTimes = 0;

    if(!suitesRoot){
        suitesRoot = parseXml(options, fs.readFileSync(options.testFile, 'utf8'));
    }

    let testSuites = suitesRoot.testsuite.filter((suite) => suite.tests !== '0');

    let avg = 0;
    let rootTime = suitesRoot.time ? Number(suitesRoot.time) : 0;
    if(suitesRoot.tests && Number(suitesRoot.tests) !== 0){
        avg = Math.ceil(rootTime * 1000)/Number(suitesRoot.tests);
    }

    parseTestSuites(options, testSuites, rootTime, avg);

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

    pending += suitesRoot.skipped ? Number(suitesRoot.skipped) :  Number(suitesRoot.tests) - totalTests;

    suiteTests += Number(suitesRoot.tests);
    suiteTime += suitesRoot.time? Number(suitesRoot.time) : 0;
    suiteFailures += Number(suitesRoot.failures);
    if(suitesRoot.tests && Number(suitesRoot.tests) !== 0){
        pendingPercent += (pending/suitesRoot.tests*100);
    }

    let duration = suiteTime !==0 ? suiteTime : testTimes;

    let mochawesome = {
        "stats": {
            "suites": suites.length,
            "tests": suiteTests,
            "passes": totalTests - suiteFailures - pending,
            "pending": options.skippedAsPending ? pending : 0,
            "failures": Number(suiteFailures),
            "testsRegistered": Number(suiteTests),
            "passPercent": Math.abs((suiteFailures/totalTests*100)-100) - pendingPercent,
            "pendingPercent": pendingPercent,
            "other": 0,
            "hasOther": false,
            "skipped": !options.skippedAsPending ? pending : 0,
            "hasSkipped": !options.skippedAsPending && pending > 0,
            "duration": Math.ceil(duration * 1000),
        },
        "results": results
    }

    fs.writeFileSync(options.reportPath, JSON.stringify(mochawesome, null, 2), 'utf8' )

    if(options.html){
        const margeOptions = {
            reportFilename: options.htmlReportFilename,
            reportDir: options.reportDir,
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