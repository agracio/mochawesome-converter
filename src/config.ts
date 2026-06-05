import * as path from 'path';
import * as fs from 'fs';
import { TestReportConverterOptions, ConverterOptions } from './interfaces';

export enum TestType {
    junit = 'junit',
    nunit = 'nunit',
    xunit = 'xunit',
    trx = 'trx',
    ctrf = 'ctrf',
}

export class ConfigService {
    static readonly TestType = TestType;

    static config(options: TestReportConverterOptions): ConverterOptions {
        if (!options) {
            throw new Error('options are required.');
        }

        if (!options.testFile) {
            throw new Error("Option 'testFile' is required.");
        }
        if (!fs.existsSync(options.testFile)) {
            throw new Error(`Could not find file ${options.testFile}.`);
        }

        const testFile: string = options.testFile;

        if (!options.testType) {
            throw new Error("Option 'testType' is required.");
        }
        if (!Object.values(TestType).includes(options.testType.toLowerCase() as TestType)) {
            throw new Error(`Test type '${options.testType}' is not supported.`);
        }

        const testType: string = options.testType.toLowerCase();

        let skippedAsPending: boolean = true;
        let switchClassnameAndName: boolean = false;
        let reportDir: string = './report';
        let reportFile: string = `${path.parse(options.testFile).name}-mochawesome.json`;
        let html: boolean = true;
        let htmlReportFile: string = `${path.parse(options.testFile).name}-mochawesome.html`;
        let htmlReportTitle: string = path.basename(options.testFile);
        let saveIntermediateFiles: boolean = false;
        let splitByClassname: boolean = false;
        let junit: boolean = false;
        let junitReportFile: string = `${path.parse(options.testFile).name}-junit.xml`;

        if (options.skippedAsPending === false || options.skippedAsPending === 'false') {
            skippedAsPending = false;
        }

        if (options.switchClassnameAndName === true || options.switchClassnameAndName === 'true') {
            switchClassnameAndName = true;
        }

        if (options.html === true || options.html === 'true') {
            html = true;
        }

        if (options.html === false || options.html === 'false') {
            html = false;
        }

        if (options.saveIntermediateFiles === true || options.saveIntermediateFiles === 'true') {
            saveIntermediateFiles = true;
        }

        if (options.splitByClassname === true || options.splitByClassname === 'true') {
            splitByClassname = true;
        }

        if (options.reportDir) {
            reportDir = options.reportDir;
        }

        if (options.reportFilename) {
            reportFile = options.reportFilename;
        }

        if (options.reportFile) {
            reportFile = options.reportFile;
        }

        if (options.htmlReportFilename) {
            htmlReportFile = options.htmlReportFilename;
        }

        if (options.htmlReportFile) {
            htmlReportFile = options.htmlReportFile;
        }

        if (options.htmlReportTitle) {
            htmlReportTitle = options.htmlReportTitle;
        }

        if (options.junit === true || options.junit === 'true') {
            junit = true;
        }

        if (options.junitReportFilename) {
            junitReportFile = options.junitReportFilename;
        }

        if (options.junitReportFile) {
            junitReportFile = options.junitReportFile;
        }

        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, {recursive: true});
        }

        return {
            testFile: testFile,
            testType: testType,
            skippedAsPending: skippedAsPending,
            switchClassnameAndName: switchClassnameAndName,
            reportDir: reportDir,
            reportPath: path.join(reportDir, reportFile),
            junit: junit,
            junitReportFile: junitReportFile,
            html: html,
            htmlReportTitle: htmlReportTitle,
            htmlReportFile: htmlReportFile,
            splitByClassname: splitByClassname,
            saveIntermediateFiles: saveIntermediateFiles,
        };
    }
}

export const config = ConfigService.config;

//export default { config, TestType: ConfigService.TestType };
