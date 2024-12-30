## Test report files to Mochawesome and JUnit converter

[![Actions Status][github-img]][github-url]
[![Codacy Badge][codacy-img]][codacy-url]
[![Git Issues][issues-img]][issues-url]
[![Closed Issues][closed-issues-img]][closed-issues-url]

### Overview

- Convert your XML/TRX test report files to Mochawesome for easy viewing and troubleshooting.
- Convert test report files to JUnit format.

### Supported report formats

- JUnit/xUnit XML Format  
- NUnit 3.0+ XML Format  
- xUnit.net v2+ XML Format  
- Visual Studio TRX Format  

### What is Mochawesome

Mochawesome is a custom test reporter originally designed for Mocha Javascript testing framework.
It features a clean modern interface allowing users to easily view and navigate test runs.  
https://github.com/adamgruber/mochawesome

<img align="right" src="./docs/NUnit-mock-assembly-dll5.png" style="padding-top: 25px" alt="Mochawesome Report" width="55%" />

### List of supported features

- Simple, clean, and modern design
- Per suite charts (via ChartJS)
- Stack trace for failed tests
- Support for displaying context information
- Filters to display only the tests you want 
- Responsive and mobile-friendly
- Offline viewing

### Features not supported by converter

- Support for test and suite nesting
- Displays before and after hooks
- Review test code inline

### Conversion process

 - All test reports except JUnit are first converted to JUnit format using XSLT.
 - TRX files undergo additional processing to enhance JUnit output.
 - Set `junit` option to `true` to get JUnit conversion results.

### All test types

- Converts &lt;skipped&gt; test messages to Mochawesome test context values.
- Converts &lt;properties&gt;, &lt;system-out&gt; and &lt;system-err&gt; to Mochawesome context values.
- Converts &lt;failure&gt; and &lt;error&gt; elements to Mochawesome error stack.
- Tests suites without any tests are excluded from Mochawesome and JUnit.
- Attachments are not supported.

### JUnit

- Converts  **&lt;properties&gt;**, **&lt;system-out&gt;** and **&lt;system-err&gt;** elements to Mochawesome test context.
- Nested test suites only supported when using `transformJunit: true` option. This will flatten nested test suites.

### NUnit

- NUnit XML version 3 and higher is supported.
- Converts **&lt;properties&gt;** elements to JUnit **&lt;properties&gt;**.
- Converts **&lt;output&gt;** elements to JUnit **&lt;system-out&gt;**.

### xUnit.net  

- xUnit.net v2+ XML is supported.
- Converts **&lt;traits&gt;** elements to  to JUnit **&lt;properties&gt;**.
- Converts `test` **&lt;reason&gt;** elements to JUnit **&lt;skipped&gt;**.
- Supports single **&lt;assembly&gt;** per file, if multiple assemblies are present only first will be converted.

### Visual Studio TRX

- Converts `Output/ErrorInfo/Message` to JUnit **&lt;failure&gt;** message.
- Converts `Output/ErrorInfo/StackTrace` to JUnit **&lt;failure&gt;** stack trace.
- Converts `Output/StdErr` to JUnit **&lt;system-err&gt;**.
- Converts `Output/StdOut` to JUnit **&lt;system-out&gt;**.
- Converts Inconclusive and NotExecuted tests to **&lt;skipped&gt;** with message.
- Test suites are split into multiple **&lt;testsuite&gt;** elements by test classname.
- Tests are ordered by name.
- Test suit times are not 100% accurate - displayed as a sum() of all test times. 

### Usage

```bash
npm i --save-dev mochawesome-converter
```

```js
const convert = require('mochawesome-converter');

let options = {
    testFile: 'mytesfiles/nunit.xml',
    testType: 'nunit',
    junit: true
}

convert(options).then(() => console.log(`Mochawesome report created`));
```

### Options

| Option                    | Type    | Default                   | Description                                       |
|:--------------------------|:--------|:--------------------------|:--------------------------------------------------|
| `testFile` **(required)** | string  |                           | Path to test file for conversion                  |
| `testType` **(required)** | string  |                           | Test report type                                  |
| `reportDir`               | string  | ./report                  | Converted report output path                      |
| `reportFilename`          | string  | mochawesome.json          | Mochawesome report name                           |
| `junit`                   | boolean | false                     | Create JUnit report?                              |
| `junitReportFilename`     | string  | `testFile.name`-junit.xml | JUnit report file name                            |
| `transformJunit`          | boolean | false                     | Transform JUnit test file with nested test suites |
| `html`                    | boolean | false                     | Create Mochawesome HTML?                          |
| `htmlReportFilename`      | string  | mochawesome.html          | Mochawesome HTML file name                        |
| `skippedAsPending`        | boolean | true                      | Show skipped tests as pending in Mochawesome      |
| `switchClassnameAndName`  | boolean | false                     | Switch test case classname and name               |

- `testFile` - relative or absolute path to input test file.
- `testType` - type of test report, not case-sensitive.
- `reportDir` - will be created if path does not exist.
- `skippedAsPending` - Mocha always reports skipped tests as pending and this is default behaviour of converter. 
  Set to `false` to display tests as skipped.
- `switchClassnameAndName` - Switches classname and name attributes of testcase if your test naming data is generated in reverse order.
- `transformJunit` - Uses XSLT processor to flatten any nested JUnit test suites. Setting `junit: true` will produce processed JUnit file.

#### Supported `testType` options.

| `testType` | File Type         |
|:-----------|:------------------|
| JUnit      | JUnit/xUnit       |
| NUnit      | NUnit 3.0+ XML    |
| xUnit      | xUnit.net v2+ XML |
| TRX        | Visual Studio TRX |




[issues-img]: https://img.shields.io/github/issues-raw/agracio/mochawesome-converter.svg?style=flat-square
[issues-url]: https://github.com/agracio/mochawesome-converter/issues
[closed-issues-img]: https://img.shields.io/github/issues-closed-raw/agracio/mochawesome-converter.svg?style=flat-square&color=brightgreen
[closed-issues-url]: https://github.com/agracio/mochawesome-converter/issues?q=is%3Aissue+is%3Aclosed

[codacy-img]: https://app.codacy.com/project/badge/Grade/1b8b8f9fdbce4267bf779197141657a2
[codacy-url]: https://app.codacy.com/gh/agracio/mochawesome-converter/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade

[github-img]: https://github.com/agracio/mochawesome-converter/workflows/Test/badge.svg
[github-url]: https://github.com/agracio/edge-js/mochawesome-converter/workflows/main.yml

