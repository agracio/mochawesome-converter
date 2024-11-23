module.exports = {
    verbose: true,
    globalTeardown: "./tests/teardown.js",
    reporters: [
        'default',
        'github-actions',
    ],
}