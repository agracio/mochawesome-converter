import * as fs from 'fs';
import * as crypto from 'crypto';
import _ from 'lodash';
import {CTRFReport, Test} from './ctrf';
import { ConverterOptions} from './interfaces';
import { MochawesomeStats, MochawesomeResult, MochawesomeSuite, MochawesomeTest, MochawesomeErr, MochawesomeRoot, MochawesomeContext,} from './mochawesome';
import { MochawesomeCommon as mochaCommon} from './mochawesomeCommon';

export class CtrfConverter {

    private suites: Record<string, MochawesomeSuite> = {};
    private results: MochawesomeResult[] = [];
    private avg: number = 0;
    private duration: number = 0;

    private readCtrfReport(options: ConverterOptions): Promise<CTRFReport> {
        return new Promise((resolve, reject) => {
            fs.promises.readFile(options.testFile, 'utf8')
                .then((content) => {
                    try {
                        resolve(JSON.parse(content) as CTRFReport);
                    } catch (error) {
                        reject(new Error(`Failed to parse ${options.testFile} as CTRF report: ${error}`));
                    }
                })
                .catch((error) => {
                    reject(new Error(`Failed to read ${options.testFile}: ${error}`));
                });
        });
    }

    private getProperties(title: string, value: Record<string, any> | null | undefined, context: MochawesomeContext[]): void {
        if(value){
            context.push({
                title: title,
                value: JSON.stringify(value, null, 2),
            });
        }
    }

    private getStdOut(title: string, value: string[] | null | undefined, context: MochawesomeContext[]): void {
        if(value){
            context.push({
                title: title,
                value: value.join('\n'),
            });
        }
    }

    private getContext(test: Test): MochawesomeContext[] | null {
        let context: any;
        if(test.stdout || test.stderr || test.parameters || test.steps){
            context = [];
            this.getProperties('Parameters', test.parameters, context);
            this.getProperties('Steps', test.steps, context);
            this.getStdOut('stdout', test.stdout, context);
            this.getStdOut('stderr', test.stderr, context);
        }
        return context;
    }

    private getError(test: Test): Partial<MochawesomeErr> {
        if(test.message || test.trace){
            return {
                message: test.message,
                estack: test.trace ? mochaCommon.sanitizeStackTrace(test.trace) : undefined,
                diff: null,
            };
        }
        return {};
    }

    private addTestStatus(status: MochawesomeResult | MochawesomeSuite, test: Test, mochaTest: MochawesomeTest): void {
        if(test.status === 'failed'){
            status.failures.push(mochaTest.uuid);
        } else if(test.status === 'pending'){
            status.pending.push(mochaTest.uuid);
        } else if(test.status === 'skipped'){
            status.skipped.push(mochaTest.uuid);
        } else if(test.status === 'passed'){
            status.passes.push(mochaTest.uuid);
        } else if(test.status === 'other' && (test.rawStatus === 'NotExecuted' || test.rawStatus === 'Inconclusive')){
            status.skipped.push(mochaTest.uuid);
        }
    }

    private parseTests(report: CTRFReport){
        const mediumTime = Math.ceil(this.avg / 2);
        let suiteName: string | null = null;

        report.results.tests.forEach((test: Test) => {

            let uuid = test.id || crypto.randomUUID();
            let err: any = {};
            if(test.suite && test.suite.length > 0){
                if(typeof test.suite === 'string'){
                    suiteName = test.suite;
                }
                else if(Array.isArray(test.suite)){
                    suiteName = test.suite.join(' > ');
                }
            }

            if(suiteName){

                if(!this.suites[suiteName]){
                    this.suites[suiteName] = {
                        file: '',
                        uuid: crypto.randomUUID(),
                        title: suiteName,
                        tests: [],
                        suites: [],
                        beforeHooks: [],
                        afterHooks: [],
                        passes: [],
                        failures: [],
                        pending: [],
                        skipped: [],
                        duration: 0,
                        root: false,
                        rootEmpty: false,
                        _timeout: 10000,
                    };
                }
            }

            let speed = 'fast';
            const duration = test.duration ? Math.ceil(test.duration) : 0;

            if (this.duration !== 0 && test.duration) {
                if (duration >= this.avg) {
                    speed = 'slow';
                } else if (duration >= mediumTime) {
                    speed = 'medium';
                } else {
                    speed = 'fast';
                }
            }

            const context = this.getContext(test);
            err = this.getError(test);

            const mochaTest: MochawesomeTest = {
                title: suiteName ? test.name.replace(`${suiteName}: `, '') : test.name,
                fullTitle: test.name,
                duration: test.duration,
                state: test.status,
                speed: speed,
                pass: test.status === 'passed',
                fail: test.status === 'failed',
                pending: test.status === 'pending',
                context: context ? JSON.stringify(context) : null,
                code: test.snippet,
                err: err,
                uuid: uuid,
                parentUUID: suiteName ? this.suites[suiteName].uuid : this.results[0].uuid,
                isHook: false,
                skipped: test.status === 'skipped' || (test.status === 'other' && (test.rawStatus === 'NotExecuted' || test.rawStatus === 'Inconclusive')),
            };

            if(suiteName){
                this.suites[suiteName].tests.push(mochaTest);
                this.addTestStatus(this.suites[suiteName], test, mochaTest);
                this.suites[suiteName].duration += duration;
            }
            else{
                this.results[0].tests.push(mochaTest);
                this.addTestStatus(this.results[0], test, mochaTest);
                this.results[0].rootEmpty = false;
                this.results[0].duration += duration;
            }
        });

        let suites = _.sortBy(Object.values(this.suites), ['title']);

        suites.forEach(suite => {
            let tests = _.sortBy(suite.tests, ['title']);
            suite.tests = tests;
            this.results[0].suites.push(suite);
        });

        if(this.results[0].tests.length > 0){
            this.results[0].tests = _.sortBy(this.results[0].tests, ['title']);
        }
    }

    /**
     * @param {ConverterOptions} options
     */
    async convert(options: ConverterOptions): Promise<void> {
        const report: CTRFReport = await this.readCtrfReport(options);

        if (!report.results || !report.results.tests) {
            return Promise.reject(`No test results found in the CTRF report: ${options.testFile}`);
        }

        if (!report.results.summary) {
            return Promise.reject(`No summary found in the CTRF report: ${options.testFile}`);
        }

        this.suites = {};
        this.results = [];
        this.avg = 0;
        this.duration = 0;

        this.results.push(mochaCommon.createResult(report.reportId || null, report.results.environment?.reportName || '', []));

        let pendingPercent = 0;

        this.duration =
            report.results.summary.duration
                ? Number(report.results.summary.duration)
                : _.sumBy(report.results.tests, function (test: Test) {
                    return Number(test.duration) || 0;
                });
        
        let tests = report.results.summary.tests || report.results.tests.length;

        if (tests !== 0) {
            this.avg = Math.ceil((this.duration) / tests);
        }

        let pending = Number(report.results.summary.pending);
        let skipped = Number(report.results.summary.skipped);
        let failed = Number(report.results.summary.failed);
        let other = Number(report.results.summary.other);
        let passes = Number(report.results.summary.passed);

        report.results.tests.forEach((test: Test) => {
            if(test.status === 'other' && (test.rawStatus === 'NotExecuted' || test.rawStatus === 'Inconclusive')){
                skipped++;
                other--;
            }
        });
            
 

        if (tests !== 0) {
            pendingPercent = (pending / tests) * 100;
        }

        this.parseTests(report);

        const stats: MochawesomeStats = mochaCommon.createStats(Object.values(this.suites).length, tests, passes, failed, pending, skipped, options, pendingPercent, other, Math.ceil(this.duration));

        const mochawesome: MochawesomeRoot = {
            stats: stats,
            results: this.results,
        };

        return mochaCommon.createMargeReport(mochawesome, options);
    }
}

const processor = new CtrfConverter();

export const convert = (options: ConverterOptions): Promise<void> => processor.convert(options);
