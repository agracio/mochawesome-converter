module.exports = {
    verbose: true,
    globalTeardown: "./tests/teardown.js",
    reporters: [
        'default',
        ['github-actions', {silent: false}], 
        'summary',
        ['jest-junit', { suiteName: "mochawesome-converter tests" }]
        // ["jest-html-reporters", {
        //     publicPath: './tests/report',
        //     filename: 'report.html',
        //     darkTheme: true,
        //     pageTitle: 'mochawesome-converter',
        //     expand: true,
        //     urlForTestFiles: 'https://github.com/agracio/mochawesome-converter/blob/main'
        //   }
        // ]
    ],
    "collectCoverageFrom": [
        "src/**/*.js"
    ],
}