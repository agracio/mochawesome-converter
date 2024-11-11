export declare type MargeConverterOptions = {
    testFile: string
    testType: string
    reportDir? : string
    reportFilename? : string
    junit?: boolean
    junitReportFilename? : string
    html?: boolean
    htmlReportFilename? : string
    skippedAsPending?: boolean
    switchClassnameAndName?: boolean
    saveIntermediateFiles?: boolean

};

declare function convert(options: MargeConverterOptions): Promise<void>;

export default convert;

// declare module 'mochawesome-converter' {


//     interface Options{
//         testFile: string
//         testType: string|TestType
//         reportDir? : string
//         reportFilename? : string
//         junit?: boolean
//         junitReportFilename? : string
//         html?: boolean
//         htmlReportFilename? : string
//         skippedAsPending?: boolean
//         switchClassnameAndName?: boolean
//         saveIntermediateFiles?: boolean
//     }



//     declare function convert(options: Options): Promise<void>;

// }
