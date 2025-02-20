interface TestReportConverterOptions {
    testFile: string
    testType: string
    reportDir? : string
    reportFilename? : string
    junit?: boolean
    junitReportFilename? : string
    transformJunit: boolean
    html?: boolean
    htmlReportFilename? : string
    skippedAsPending?: boolean
    switchClassnameAndName?: boolean
    saveIntermediateFiles?: boolean

}

declare function convert(options: TestReportConverterOptions): Promise<void>;

export default convert;

