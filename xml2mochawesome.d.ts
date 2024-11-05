declare module 'xml2mochawesome' {
    
    function convert(options: Options): void

    interface Options{
        testFile: string
        reportType: ReportType
        skippedAsPending?: boolean
        switchClassnameAndName?: boolean
        reportDir? : string
        reportFilename? : string
        html?: boolean
        htmlReportDir? : string
        htmlReportFilename? : string
        saveIntermediateFiles?: boolean
    }

    enum ReportType {
        JUnit,
        NUnit,
        XUnit,
    }
}
