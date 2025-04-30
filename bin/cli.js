#!/usr/bin/env node

const yargs = require('yargs');
const { yargsOptions } = require('./options');
const { config } = require('../src/config');
const convert = require('../src/converter');

yargs
    .usage('Usage: $0 [options]')
    .example('$0 --testFile mytesfiles/nunit.xml --testType nunit', '')
    .demandOption(['testFile','testType'])
    .options(yargsOptions)
    .help('help')
    .alias('h', 'help')
    .version().argv;

const options = (config(yargs.argv));
convert(yargs.argv).then(() => console.log(`Report created at '${options.reportDir}/'`));

