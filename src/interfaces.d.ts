export interface TestReportConverterOptions {
    testFile: string;
    testType: string;
    skippedAsPending?: boolean | string;
    switchClassnameAndName?: boolean | string;
    reportDir?: string;
    reportFilename?: string;
    reportFile?: string;
    htmlReportFilename?: string;
    htmlReportFile?: string;
    htmlReportTitle?: string;
    junit?: boolean | string;
    junitReportFilename?: string;
    junitReportFile?: string;
    saveIntermediateFiles?: boolean | string;
    splitByClassname?: boolean | string;
    html?: boolean | string;
}

export interface ConverterOptions {
    testFile: string;
    testType: string;
    skippedAsPending?: boolean;
    switchClassnameAndName?: boolean;
    reportDir?: string;
    reportPath: string;
    reportFile?: string;
    junit?: boolean;
    junitReportFile?: string;
    html?: boolean;
    htmlReportFile?: string;
    htmlReportTitle?: string;
    splitByClassname?: boolean;
    saveIntermediateFiles?: boolean;
}

export interface JunitTestSuites {
    name?: string;
    classname?: string;
    tests: string | number;
    failures: string | number;
    errors?: string | number;
    skipped: string | number;
    disabled?: string | number;
    assertions?: string | number;
    time: string | number;
    timestamp?: string;
    testsuite: JunitTestSuite[];
}

export interface JunitTestSuite {
    name: string;
    classname?: string;
    file?: string;
    tests: string | number;
    passed?: string | number;
    failures: string | number;
    errors?: string | number;
    skipped: string | number;
    disabled?: string | number;
    time: string | number;
    timestamp?: string;
    testcase: JunitTestCase[];
}

export interface JunitTestCase {
    name: string;
    classname: string;
    status: string;
    time: string;
    failure?: JunitCaseFailure[];
    error?: JunitCaseError[];
    properties?: JunitProperty[];
    skipped?: JunitSkippedInfo[];
    'system-out'?: JunitSystemInfo[];
    'system-err'?: JunitSystemInfo[];
}

export interface JunitCaseFailure {
    type?: string;
    message?: string;
    $t?: string;
}

export type JunitCaseError = JunitCaseFailure;

export interface JunitProperty {
    property: JunitPropertyItem[];
}

export interface JunitPropertyItem {
    name: string;
    value: string;
}

export interface JunitSkippedInfo {
    message?: string;
}

export interface JunitSystemInfo {
    $t?: string;
}

export interface JunitErrorMessage {
    message: string;
    estack: string;
    diff: string | null;
}

