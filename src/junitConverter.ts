import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import _ from 'lodash';
import { TestSuites as JunitReport } from 'junit-converter';
import { JunitTestSuites, JunitTestSuite, JunitTestCase, ConverterOptions, JunitErrorMessage} from './interfaces';
import { MochawesomeStats, MochawesomeResult, MochawesomeSuite, MochawesomeTest, MochawesomeErr, MochawesomeRoot,} from './mochawesome';
import { MochawesomeCommon as mochaCommon} from './mochawesomeCommon';

export class JunitConverter {

    private skippedTests: number = 0;
    private failedTests: number = 0;
    private suites: MochawesomeSuite[] = [];

    private sanitizeXml(xml: string): string {
        return xml
            .replaceAll('&#xD;', '')
            .replaceAll('&#xA;', '')
            .replaceAll('&#x27;', "'")
            .replaceAll('&#x3C;', '<')
            .replaceAll('&#x3E;', '>')
            .replaceAll('&#x22;', '"');
    }

    /**
     * @param {JunitTestCase} testcase
     * @returns {JunitErrorMessage|{}}
     */
    private getError(testcase: JunitTestCase): Partial<JunitErrorMessage> {
        if (!testcase.failure && !testcase.error) {
            return {};
        }
        let estack: string | undefined;
        let message: string | undefined;
        const failure = testcase.failure ? testcase.failure : testcase.error;
        const fail = failure![0];
        const prefix = fail.type ? `${fail.type}: ` : '';
        const diff = null;

        if (fail.message) {
            message = `${prefix}${fail.message.replaceAll('&#xD;', '').replaceAll('&#xA;', '')}`;
        }
        if (fail.$t) {
            estack = this.sanitizeXml(fail.$t)
            .replace(/^[\r\n]+|[\r\n]+$/g, '')
            .replaceAll('                ', '')
            .replaceAll('            ', '')
            .replaceAll('\r\n   ', '\r\n')
            .replaceAll('\n   ', '\n');

        } else if (typeof fail === 'string') {
            estack = fail;
        }

        return {
            message: message,
            estack: estack,
            diff: diff,
        };
    }

    /**
     * @param {JunitTestCase} testcase
     */
    private getContext(testcase: JunitTestCase): any {
        let context: any;

        if (
            (testcase.skipped && testcase.skipped[0].message) ||
            (testcase.properties && testcase.properties.length !== 0 && testcase.properties[0].property) ||
            (testcase['system-out'] && testcase['system-out'].length !== 0) ||
            (testcase['system-err'] && testcase['system-err'].length !== 0)
        ) {
            context = [];
            let skipped = '';

            if (testcase.properties && testcase.properties.length !== 0 && testcase.properties[0].property) {
                const properties: string[] = [];
                testcase.properties[0].property.forEach((property: any) => {
                    properties.push(`${property.name}: ${property.value}`);
                });
                context.push({
                    title: 'Properties',
                    value: properties,
                });
            }

            if (testcase.skipped && testcase.skipped[0].message) {
                skipped = this.sanitizeXml(testcase.skipped[0].message);
                context.push(`skipped: ${skipped}`);
            }

            if (testcase['system-out'] && testcase['system-out'].length !== 0) {
                this.extractSystemMessage('system-out', skipped, testcase['system-out'][0], context);
            }

            if (testcase['system-err'] && testcase['system-err'].length !== 0) {
                this.extractSystemMessage('system-err', skipped, testcase['system-err'][0], context);
            }
        }
        return context;
    }

    private extractSystemMessage(name: string, skipped: string, systemMessage: any, context: any[]): void {
        let message = systemMessage;
        if (systemMessage.$t) {
            message = this.sanitizeXml(systemMessage.$t);
        }
        if (message !== skipped) {
            context.push({
                title: name,
                value: message,
            });
        }
    }

    /**
     * @param {ConverterOptions} options
     * @param {[JunitTestSuite]} testSuites
     * @param {Number} totalSuiteTime
     * @param {Number} avgSuiteTime
     */
    private parseTestSuites(options: ConverterOptions, testSuites: JunitTestSuite[], totalSuiteTime: number, avgSuiteTime: number): void {
        const mediumTime = Math.ceil(avgSuiteTime / 2);

        testSuites.forEach((suite: JunitTestSuite) => {
            const tests: MochawesomeTest[] = [];
            const passes: string[] = [];
            const failures: string[] = [];
            const pending: string[] = [];

            const parentUUID = crypto.randomUUID();
            let suiteDuration: number = 0;

            suite.testcase.forEach((testcase: JunitTestCase) => {
                const context = this.getContext(testcase);
                let err: any = {};

                const uuid = crypto.randomUUID();
                let state = 'passed';

                if ((testcase.status && testcase.status.toLowerCase() === 'failed') || testcase.failure || testcase.error) {
                    err = this.getError(testcase);
                    state = 'failed';
                    this.failedTests++;
                }

                if ((testcase.status && testcase.status.toLowerCase() === 'skipped') || testcase.skipped) {
                    state = options.skippedAsPending ? 'pending' : 'skipped';
                    this.skippedTests++;
                }

                let speed = 'fast';
                const duration = testcase.time ? Math.ceil(Number(testcase.time) * 1000) : 0;
                suiteDuration += duration;

                if (totalSuiteTime && totalSuiteTime !== 0 && testcase.time) {
                    if (duration >= avgSuiteTime) {
                        speed = 'slow';
                    } else if (duration >= mediumTime) {
                        speed = 'medium';
                    } else {
                        speed = 'fast';
                    }
                }

                const test: MochawesomeTest = {
                    title: options.switchClassnameAndName ? testcase.classname : testcase.name,
                    fullTitle: options.switchClassnameAndName ? testcase.name : testcase.classname,
                    duration: duration,
                    state: state,
                    speed: speed,
                    pass: !(testcase.failure || testcase.error || testcase.skipped),
                    fail: testcase.failure || testcase.error ? true : false,
                    pending: options.skippedAsPending ? (testcase.skipped ? true : false) : false,
                    context: context ? JSON.stringify(context) : null,
                    code: null,
                    err: err,
                    uuid: uuid,
                    parentUUID: parentUUID,
                    isHook: false,
                    skipped: !options.skippedAsPending ? (testcase.skipped ? true : false) : false,
                };

                tests.push(test);

                if (test.fail) {
                    failures.push(uuid);
                }

                if (test.pass) {
                    passes.push(uuid);
                }

                if (test.pending || test.skipped) {
                    pending.push(uuid);
                }
            });

            let suiteFile = suite.file ? path.basename(suite.file.replaceAll('\\', '/')) : undefined;
            if (!suiteFile && suite.classname) {
                suiteFile = suite.classname;
            }

            this.suites.push({
                uuid: parentUUID,
                title: suite.name.replaceAll('Root Suite.', ''),
                fullFile: suite.file,
                file: suiteFile ?? '',
                beforeHooks: [],
                afterHooks: [],
                tests: tests,
                suites: [],
                passes: passes,
                failures: failures,
                pending: options.skippedAsPending ? pending : [],
                skipped: options.skippedAsPending ? [] : pending,
                duration: suite.time && Number(suite.time) !== 0 ? Math.ceil(Number(suite.time) * 1000) : suiteDuration,
                root: false,
                rootEmpty: false,
                _timeout: 10000,
            });
        });
    }

    private prepareJson(options: ConverterOptions, json: JunitReport): JunitTestSuites | null {
        if (
            (json && json.testsuites && json.testsuites.length && json.testsuites.length === 0) ||
            !json ||
            !json.testsuites ||
            !json.testsuites.length ||
            !json.testsuites[0].testsuite ||
            !json.testsuites[0].testsuite.length ||
            json.testsuites[0].testsuite.length === 0
        ) {
            console.log('No test suites found, skipping Mochawesome file creation.');
            return null;
        }

        if (options.saveIntermediateFiles) {
            const fileName = `${path.parse(options.testFile).name}-converted.json`;
            fs.writeFileSync(path.join(options.reportDir!, fileName), JSON.stringify(json, null, 2), 'utf8');
        }

        // sort test suites
        if (json.testsuites[0].testsuite[0].file && json.testsuites[0].testsuite[0].name) {
            json.testsuites[0].testsuite = _.sortBy(json.testsuites[0].testsuite, ['file', 'name']);
        } else if (json.testsuites[0].testsuite[0].name) {
            json.testsuites[0].testsuite = _.sortBy(json.testsuites[0].testsuite, ['name']);
        }

        return json.testsuites[0];
    }

    /**
     * @param {ConverterOptions} options
     * @param {JunitTestSuites} suitesRoot
     */
    async convert(options: ConverterOptions, json: JunitReport): Promise<void> {
        let suitesRoot: JunitTestSuites | null = this.prepareJson(options, json);
        if (!suitesRoot) {
            return Promise.resolve();
        }

        const results: MochawesomeResult[] = [];

        this.skippedTests = 0;
        this.failedTests = 0;
        this.suites = [];
        let pending = 0;
        let pendingPercent = 0;
        let suiteFailures = 0;

        const testSuites = suitesRoot.testsuite.filter((suite: JunitTestSuite) => suite.tests !== '0');

        let duration =
            suitesRoot.time
                ? Number(suitesRoot.time)
                : _.sumBy(testSuites, function (suite: JunitTestSuite) {
                    return Number(suite.time);
                });

        if (duration === 0) {
            duration = _.sumBy(testSuites, (suite: JunitTestSuite) =>
                _.sumBy(suite.testcase, function (testCase: JunitTestCase) {
                    return Number(testCase.time);
                })
            );
        }

        let tests = suitesRoot.tests
            ? Number(suitesRoot.tests)
            : _.sumBy(testSuites, function (suite: JunitTestSuite) {
                return Number(suite.tests);
            });

        let avg = 0;

        if (tests !== 0) {
            avg = Math.ceil((duration * 1000) / tests);
        }

        this.parseTestSuites(options, testSuites, duration, avg);

        const name = suitesRoot.name;

        results.push(mochaCommon.createResult(null, name || '', this.suites));

        pending = suitesRoot.skipped ? Number(suitesRoot.skipped) : this.skippedTests;

        if (suitesRoot.failures) {
            suiteFailures += Number(suitesRoot.failures);
        }
        if (suitesRoot.errors) {
            suiteFailures += Number(suitesRoot.errors);
        }
        if (!suitesRoot.failures && !suitesRoot.errors) {
            suiteFailures = this.failedTests;
        }

        if (tests !== 0) {
            pendingPercent = (pending / tests) * 100;
        }
        const stats: MochawesomeStats = mochaCommon.createStats(
            this.suites.length, 
            tests, 
            suiteFailures, 
            options.skippedAsPending ? pending : 0, 
            !options.skippedAsPending ? pending : 0, 
            options, 
            pendingPercent, 
            0, 
            Math.ceil(duration * 1000));

        const mochawesome: MochawesomeRoot = {
            stats: stats,
            results: results,
        };

        return mochaCommon.createMargeReport(mochawesome, options);
    }
}

const processor = new JunitConverter();

export const convert = (options: ConverterOptions, json: JunitReport): Promise<void> => processor.convert(options, json);

//export default { prepareJson, convert };

