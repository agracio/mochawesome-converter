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
    splitByClassname?: boolean;
    saveIntermediateFiles?: boolean;
}

export interface TestSuites {
    name: string;
    tests: string;
    failures: string;
    errors: string;
    skipped: string;
    time: string;
    testsuite: TestSuite[];
}

export interface TestSuite {
    name: string;
    classname: string;
    file?: string;
    tests: string;
    failures: string;
    skipped: string;
    time: string;
    testcase: TestCase[];
}

export interface TestCase {
    name: string;
    classname: string;
    status: string;
    time: string;
    failure?: CaseFailure[];
    error?: CaseError[];
    properties?: Property[];
    skipped?: SkippedInfo[];
    'system-out'?: SystemInfo[];
    'system-err'?: SystemInfo[];
}

export interface CaseFailure {
    type?: string;
    message?: string;
    $t?: string;
}

export type CaseError = CaseFailure;

export interface Property {
    property: PropertyItem[];
}

export interface PropertyItem {
    name: string;
    value: string;
}

export interface SkippedInfo {
    message?: string;
}

export interface SystemInfo {
    $t?: string;
}

export interface ErrorMessage {
    message: string;
    estack: string;
    diff: string | null;
}

