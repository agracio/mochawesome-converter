declare module 'xml2mochawesome' {
    
    function xml2mochawesome(options: Options): void

    interface Options{
        testFile: string
        testType: string|TestType
        skippedAsPending?: boolean
        switchClassnameAndName?: boolean
        reportDir? : string
        reportFilename? : string
        html?: boolean
        htmlReportDir? : string
        htmlReportFilename? : string
        saveIntermediateFiles?: boolean
    }

    enum TestType {
        JUnit,
        NUnit,
        XUnit,
    }
}
