module.exports = {
    verbose: true,
    globalTeardown: "./tests/teardown.js",
    preset: "ts-jest",
    reporters: [
        'default',
        ['github-actions', {silent: false}], 
        'summary',
        ['jest-junit', { suiteName: "mochawesome-converter tests" }]
    ],
    testMatch: ["<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}"],
    collectCoverage: true,
    "collectCoverageFrom": [
        "lib/**/*.js"
    ],
    coverageDirectory: "coverage",
}