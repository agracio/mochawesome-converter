export const yargsOptions = {
    testFile: {
        describe: 'Path to test file',
        string: true,
        default: undefined,
    },
    testType: {
        describe: 'Test type',
        string: true,
        default: undefined,
    },
    reportDir: {
        default: './report',
        describe: 'Report output directory',
        string: true,
    },
    reportFile: {
        default: undefined,
        describe: 'Mochawesome json report file name',
        string: true,
    },
    junit: {
        default: false,
        describe: 'Create JUnit XML report?',
        boolean: true,
    },
    junitReportFile: {
        describe: 'JUnit report file name',
        string: true,
        default: undefined,
    },
    html: {
        default: false,
        describe: 'Create Mochawesome HTML?',
        boolean: true,
    },
    htmlReportFile: {
        default: undefined,
        describe: 'Mochawesome HTML file name',
        string: true,
    },
    splitByClassname: {
        default: false,
        describe: 'Split into multiple test suites by test classname',
        boolean: true,
    },
    skippedAsPending: {
        default: true,
        describe: 'Show skipped tests as pending in Mochawesome report',
        boolean: true,
    },
    switchClassnameAndName: {
        default: false,
        describe: 'Switch test case classname and name',
        boolean: true,
    },
};