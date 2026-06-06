import * as fs from 'fs';
import * as crypto from 'crypto';
import _ from 'lodash';
import {CTRFReport, Results, Summary, Test, Step} from './ctrf';
import { ConverterOptions} from './interfaces';
import { MochawesomeStats, MochawesomeResult, MochawesomeSuite, MochawesomeTest, MochawesomeErr, MochawesomeRoot,} from './mochawesome';
import { MochawesomeCommon as mochaCommon} from './mochawesomeCommon';

export class CtrfConverter {

    private suites: Record<string, MochawesomeSuite> = {};
    private results: MochawesomeResult[] = [];
    private avg: number = 0;

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

    private getProperties(title: string, value: Record<string, any> | null | undefined, context: any[]): any {
        if(value){
            context.push({
                title: title,
                value: JSON.stringify(value, null, 2),
            });
        }
    }

    private getStdOut(title: string, value: string[] | null | undefined, context: any[]): any {
        if(value){
            context.push({
                title: title,
                value: value.join('\n'),
            });
        }
    }

    private getContext(test: Test): any{
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

    private parseTests(report: CTRFReport, totalSuiteTime: number){
        const mediumTime = Math.ceil(this.avg / 2);
        let suiteName: string | null = null;

        report.results.tests.forEach((test: Test) => {

            let uuid = crypto.randomUUID();
            let err: any = {};
            if(test.suite && test.suite.length > 0){
                suiteName = test.suite.join(' > ');
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

            if (totalSuiteTime && totalSuiteTime !== 0 && test.duration) {
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
                title: test.name,
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
                skipped: test.status === 'skipped',
            };
            if(suiteName){
                this.suites[suiteName].tests.push(mochaTest);
                if(test.status === 'failed'){
                    this.suites[suiteName].failures.push(mochaTest.uuid);
                }
                else if(test.status === 'pending'){
                    this.suites[suiteName].pending.push(mochaTest.uuid);
                }
                else if(test.status === 'skipped'){
                    this.suites[suiteName].skipped.push(mochaTest.uuid);
                }
                else if(test.status === 'passed'){
                    this.suites[suiteName].passes.push(mochaTest.uuid);
                }
                this.suites[suiteName].duration += duration;
            }
            else{
                this.results[0].tests.push(mochaTest);
                if(test.status === 'failed'){
                    this.results[0].failures.push(mochaTest.uuid);
                }
                else if(test.status === 'pending'){
                    this.results[0].pending.push(mochaTest.uuid);
                }
                else if(test.status === 'skipped'){
                    this.results[0].skipped.push(mochaTest.uuid);
                }
                else if(test.status === 'passed'){
                    this.results[0].passes.push(mochaTest.uuid);
                }
                this.results[0].rootEmpty = false;
                this.results[0].duration += duration;}

        });

        Object.values(this.suites).forEach(suite => {
            this.results[0].suites.push(suite);
        });
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

        this.results.push(mochaCommon.createResult(report.reportId || null, report.results.environment?.reportName || '', []));

        let pendingPercent = 0;

        let duration =
            report.results.summary.duration
                ? Number(report.results.summary.duration)
                : _.sumBy(report.results.tests, function (test: Test) {
                    return Number(test.duration) || 0;
                });
        
        let tests = report.results.summary.tests || report.results.tests.length;

        if (tests !== 0) {
            this.avg = Math.ceil((duration) / tests);
        }

        let pending = Number(report.results.summary.pending);
        let skipped = Number(report.results.summary.skipped);

        if (tests !== 0) {
            pendingPercent = (pending / tests) * 100;
        }
        let failed = Number(report.results.summary.failed);
        let other = Number(report.results.summary.other);

        this.parseTests(report, duration);

        const stats: MochawesomeStats = mochaCommon.createStats(Object.values(this.suites).length, tests, failed, pending, skipped, options, pendingPercent, other, Math.ceil(duration));

        const mochawesome: MochawesomeRoot = {
            stats: stats,
            results: this.results,
        };

        return mochaCommon.createMargeReport(mochawesome, options);
    }
}

const processor = new CtrfConverter();

export const convert = (options: ConverterOptions): Promise<void> => processor.convert(options);
