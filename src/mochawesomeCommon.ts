import * as fs from 'fs';
import * as crypto from 'crypto';
import {create as margeCreate} from 'mochawesome-report-generator';
import { MochawesomeStats, MochawesomeResult, MochawesomeSuite, MochawesomeTest, MochawesomeErr, MochawesomeRoot,} from './mochawesome';
import { ConverterOptions} from './interfaces';

export class MochawesomeCommon {
    static createStats(suites: number, tests: number, failures: number, pending: number, skipped: number, options: ConverterOptions, pendingPercent: number, other: number, duration: number): MochawesomeStats {
        return {
            suites: suites,
            tests: tests,
            passes: tests - failures - pending - skipped - other,
            pending: pending,
            failures: failures,
            testsRegistered: tests,
            passPercent: tests !== 0 ? Math.abs((failures / tests) * 100 - 100) - pendingPercent : 0,
            pendingPercent: pendingPercent,
            other: other,
            hasOther: other > 0,
            skipped: skipped,
            hasSkipped: skipped > 0,
            duration: duration,
        };
    }

    static createMargeReport(mochawesome: MochawesomeRoot, options: ConverterOptions): Promise<void> {
        fs.writeFileSync(options.reportPath, JSON.stringify(mochawesome, null, 2), 'utf8');
        
        if (options.html) {
            const margeOptions = {
                reportFilename: options.htmlReportFile,
                reportDir: options.reportDir,
                showSkipped: true,
                reportTitle: options.htmlReportTitle
            };

            return margeCreate(mochawesome, margeOptions);
        }
        else{
            return Promise.resolve();
        }
    }

    static createResult(id: string | null = null, title: string, suites: MochawesomeSuite[]): MochawesomeResult {
        return {
            uuid: id || crypto.randomUUID(),
            title: title,
            fullFile: '',
            file: '',
            beforeHooks: [],
            afterHooks: [],
            tests: [],
            suites: suites,
            passes: [],
            failures: [],
            pending: [],
            skipped: [],
            duration: 0,
            root: true,
            rootEmpty: true,
            _timeout: 10000,
        };
    }
}

const common = new MochawesomeCommon();

// export const createStats = (suites: number, tests: number, failures: number, pending: number, options: ConverterOptions, pendingPercent: number, duration: number): MochawesomeStats => common.createStats(suites, tests, failures, pending, options, pendingPercent, duration);