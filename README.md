## XML test reports to Mochawesome converter

### What is Mochawesome
Mochawesome is a custom test reporter originally designed to for Mocha Javascript testing framework.
It features a clean modern interface allowing users to easily view and navigate test runs.  
https://github.com/adamgruber/mochawesome


<img align="right" src="./docs/NUnit-mock-assembly-dll5.png" alt="Mochawesome Report" width="50%" />

### List of supported features:

- Simple, clean, and modern design - HTML view
- Per suite charts (via ChartJS) - HTML view
- Stack trace for failed tests - JSON and HTML
- Support for displaying context information - JSON and HTML
- Filters to display only the tests you want - HTML view
- Responsive and mobile-friendly - HTML view
- Offline viewing

### Features not supported by converter

- Support for test and suite nesting
- Displays before and after hooks
- Review test code inline
- Support for adding context information to tests  
  There is no programmatic support to add context to tests,  
  instead contexts is added from XML artifacts as described in overview

### Overview
- **Convert your XML test reports to Mochawesome for easy viewing and troubleshooting.**  
- **Generate Mochawesome JSON and optional HTML output.**
- **Converts &lt;properties&gt;,  &lt;traits&gt;, &lt;system-out&gt; and &lt;system-err&gt; XML tags to Mochawesome context values.**
- **Converts skipped test messages to Mochawesome context values.**

### Supported report formats

* JUnit XML Format
* NUnit 3.0+ XML Format
* xUnit.net v2+ XML Format
  
### Project implementation and documentation are being updated ... 



