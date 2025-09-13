interface TestReportConverterOptions {
    testFile: string
    testType: string
    reportDir? : string
    /**
     * @deprecated Use reportFile instead.
     */
    reportFilename? : string
    reportFile? : string
    junit?: boolean
    /**
     * @deprecated Use junitReportFile instead.
     */
    junitReportFilename? : string
    junitReportFile? : string
    html?: boolean
    /**
     * @deprecated Use htmlReportFile instead.
     */
    htmlReportFilename? : string
    htmlReportFile? : string
    skippedAsPending?: boolean
    switchClassnameAndName?: boolean
    splitByClassname?: boolean
    saveIntermediateFiles?: boolean

}

declare function convert(options: TestReportConverterOptions): Promise<void>;

export default convert;

