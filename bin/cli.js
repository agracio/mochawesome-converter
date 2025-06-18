#!/usr/bin/env node

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const { yargsOptions } = require('./options');
const { config } = require('../src/config');
const convert = require('../src/converter');

const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .example('$0 --testFile mytesfiles/nunit.xml --testType nunit', '')
    .demandOption(['testFile','testType'])
    .options(yargsOptions)
    .help('help')
    .alias('h', 'help')
    .version()
    .parse();

const options = (config(argv));
convert(argv).then(() => console.log(`Report created at '${options.reportDir}/'`));

