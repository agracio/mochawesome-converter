## Test report files to Mochawesome and JUnit converter

### Overview

- Convert your XML/TRX test report files to Mochawesome for easy viewing and troubleshooting.
- Convert test report files to JUnit format.

### Supported report formats

- JUnit XML Format  
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

### All test types

- Converts &lt;skipped&gt; test messages to Mochawesome test context values.
- Converts &lt;failure&gt; and &lt;error&gt; elements to Mochawesome error stack.
- Test suites are displayed in alphabetical order by `file`, `classname` and `name` attributes.
- Tests suites without any tests are not displayed.
- Attachments currently not supported.

### JUnit 

- Converts `testcase` **&lt;properties&gt;**, **&lt;system-out&gt;** and **&lt;system-err&gt;** elements to Mochawesome test context.
- Nested tests and test suites currently not supported.

### NUnit

- NUnit XML version 3 and higher is supported.
- Converts `test-case` **&lt;properties&gt;** elements to Mochawesome 'Properties' test context.
- Converts `test-case` **&lt;output&gt;** elements to Mochawesome 'system-out' test context.
- Nested `test-suite` elements are flattened and appear in `classname->name` order.

### xUnit  

- xUnit.net v2+ XML is supported.
- Converts `test` **&lt;traits&gt;** elements to Mochawesome 'Properties' test context.
- Supports single **&lt;assembly&gt;** per file, if multiple assemblies are present only first will be converted.

### Visual Studio TRX

 - Does not resolve test suite and test times.

### Usage

### Options

| Option                    | Type    | Default                   | Description                           |
|:--------------------------|:--------|:--------------------------|:--------------------------------------|
| `testFile` **(required)** | string  |                           | Path to test file for conversion      |
| `testType` **(required)** | string  |                           | Test report type                      |
| `reportDir`               | string  | ./report                  | Converted report output path          |
| `reportFilename`          | string  | mochawesome.json          | Mochawesome report name               |
| `junit`                   | boolean | false                     | Create JUnit report?                  |
| `junitReportFilename`     | string  | `testFile.name`-junit.xml | JUnit report file name                |
| `html`                    | boolean | false                     | Create Mochawesome HTML?              |
| `htmlReportFilename`      | string  | mochawesome.html          | Mochawesome HTML file name            |
| `skippedAsPending`        | boolean | true                      | Show skipped tests as pending in HTML |

- `testFile` - relative or absolute path to input test file.
- `testType` - type of test report, not case-sensitive.
- `skippedAsPending` - Mocha always reports skipped tests as pending and this is default behaviour of converter. 

#### Supported `testType` options.

| testType   |
|:-----------|
| JUnit      |
| NUnit      |
| xUnit      |
| TRX        |




## Implementation and documentation in progress...



