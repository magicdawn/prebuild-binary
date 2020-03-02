#!/usr/bin/env node

const util = require('util')
const fs = require('fs')
const file = __dirname + '/../logs/completion.log'

const log = (content, ...extra) => {
  content = util.format(content, ...extra)
  fs.appendFileSync(file, content + '\n')
}

/* eslint camelcase: off */
process.env.https_proxy = 'http://127.0.0.1:7890'
process.env.http_proxy = 'http://127.0.0.1:7890'
process.env.all_proxy = 'socks5://127.0.0.1:7891'

const argv = require('yargs')
  .commandDir(__dirname + '/commands')
  .completion('completion', async (current, argv) => {
    // log('--------')
    // log(current)
    // log(argv)
    const cmds = argv._.filter(Boolean)

    // only the script name
    if (cmds.length === 1) {
      return ['update']
    }

    if (cmds.length > 1) {
      const cmd = cmds[cmds.length - 1]
      if (cmd === 'update') {
        if (typeof argv.name === 'undefined') {
          return ['--name']
        }
      }
      return []
    }

    return []
  })
  .demandCommand()
  .help().argv
