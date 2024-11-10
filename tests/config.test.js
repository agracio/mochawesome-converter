const path = require('path');
const config = require('../src/config');

describe("Config tests", () => {

    test('should throw if no options are provided', () => {
        expect(() => config.config()).toThrow(/^options are required/);
    });

    test('should throw if testFile is not provided', () => {
        expect(() => config.config({})).toThrow(/^Option 'testFile' is required/);
    });

    test('should throw if testFile cannot be resolved', () => {
        let options = {
            testFile: 'mytestfile.xml'
        }
        expect(() => config.config(options)).toThrow(/^Could not find file/);
    });

    test('should throw if testType is not provided', () => {
        let options = {
            testFile: path.join(__dirname, 'data/source/xunit.xml')
        }
        expect(() => config.config(options)).toThrow(/^Option 'testType' is required/);
    });

    test('should throw if testType is incorrect', () => {
        let options = {
            testFile: path.join(__dirname, 'data/source/xunit.xml'),
            testType: 'xunit123'
        }
        expect(() => config.config(options)).toThrow(/^Test type 'xunit123' is not supported/);
    });

    test('should return correct default values', () => {
        let options = {
            testFile: path.join(__dirname, 'data/source/xunit.xml'),
            testType: 'xunit'
        }

        let result = config.config(options)

        expect(result.testFile).toBe(path.join(__dirname, 'data/source/xunit.xml'));
        expect(result.testType).toBe('xunit');
        expect(result.skippedAsPending).toBe(true);
        expect(result.switchClassnameAndName).toBe(false);
        expect(result.reportDir).toBe('./report');
        expect(result.reportPath).toBe(path.join(result.reportDir, 'mochawesome.json'));
        expect(result.junit).toBe(false);
        expect(result.junitReportFilename).toBe('xunit-junit.xml');
        expect(result.html).toBe(false);
        expect(result.htmlReportFilename).toBe('mochawesome.html');
        expect(result.saveIntermediateFiles).toBe(false);
    });

    test('should have correct values from assigned options', () => {
        let options = {
            testFile: path.join(__dirname, 'data/source/xunit.xml'),
            testType: 'xunit',
            skippedAsPending: false,
            switchClassnameAndName: true,
            reportDir: './report1',
            reportFilename: 'mochawesome1.json',
            junit: true,
            junitReportFilename: 'xunit-j.xml',
            html: true,
            htmlReportFilename: 'mochawesome1.html',
            saveIntermediateFiles: true
        }

        let result = config.config(options)

        expect(result.testFile).toBe(path.join(__dirname, 'data/source/xunit.xml'));
        expect(result.testType).toBe('xunit');
        expect(result.skippedAsPending).toBe(false);
        expect(result.switchClassnameAndName).toBe(true);
        expect(result.reportDir).toBe('./report1');
        expect(result.reportPath).toBe(path.join(result.reportDir, 'mochawesome1.json'));
        expect(result.junit).toBe(true);
        expect(result.junitReportFilename).toBe('xunit-j.xml');
        expect(result.html).toBe(true);
        expect(result.htmlReportFilename).toBe('mochawesome1.html');
        expect(result.saveIntermediateFiles).toBe(true);
    });

    // test('[5] should result in "buzz"', () => {
    //     expect(fizz_buzz([5])).toBe('buzz');
    // });
    //
    // test('[15] should result in "fizzbuzz"', () => {
    //     expect(fizz_buzz([15])).toBe('fizzbuzz');
    // });
    //
    // test('[1,2,3] should result in "1, 2, fizz"', () => {
    //     expect(fizz_buzz([3])).toBe('fizz');
    // });

});