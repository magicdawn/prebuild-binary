#!/usr/bin/env node

const util = require('util')
const fs = require('fs')

/* eslint camelcase: off */
// process.env.https_proxy = 'http://127.0.0.1:7890'
// process.env.http_proxy = 'http://127.0.0.1:7890'
// process.env.all_proxy = 'socks5://127.0.0.1:7891'

const argv = require('yargs')
  .commandDir(__dirname + '/commands')
  .demandCommand()
  .help().argv
