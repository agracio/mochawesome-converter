
interface ConverterOptions{
    testFile: string,
    testType: string,
    skippedAsPending: boolean,
    switchClassnameAndName: boolean,
    reportPath : string,
    html: boolean,
    htmlReportDir? : string
    htmlReportFilename? : string
    saveIntermediateFiles: boolean,
}

interface TestSuites{
    name: string,
    tests: string,
    failures: string,
    errors: string,
    skipped: string,
    time: string,
    testsuite: [TestSuite]
}

interface TestSuite{
    name: string,
    classname: string,
    file?: string,
    tests: string,
    failures: string,
    skipped: string,
    time: string,
    testcase: [TestCase]
}

interface TestCase{
    name: string,
    classname: string,
    status: string,
    time: string,
    failure?: [CaseFailure],
    error?: [CaseError],
    properties?: [{
        property:[{
            name: string,
            value: string
        }]
    }],
    skipped?:[{message?: string}]
}


interface CaseFailure{
    type?: string,
    message?: string,
    $t?: string
}

interface CaseError extends CaseFailure{}

interface ErrorMessage{
    message: string,
    estack: string,
    diff: string
}

