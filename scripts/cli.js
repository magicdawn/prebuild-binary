#!/usr/bin/env node

const argv = require('yargs')
  .commandDir(__dirname + '/commands')
  .demandCommand()
  .help().argv
