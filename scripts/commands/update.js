const {join} = require('path')
const dl = require('dl-vampire')
const gh = require('ghreleases')
const rc = require('rc')('prebuild-binary')
const pify = require('promise.ify')
const pmap = require('promise.map')
const config = require('../config')
const semver = require('semver')

module.exports = {
  command: 'update',
  alias: ['u'],
  describe: 'update the package',
  builder(yargs) {
    return yargs.options({
      name: {
        type: 'string',
        description: '包含的名称',
      },
    })
  },
  async handler(argv) {
    const name = argv.name
    const pkgs = config.pkgs.filter(item => {
      if (!name) return true
      return item.repo.includes(name) || item.user.includes(name)
    })

    for (let item of pkgs) {
      await update(item)
    }
  },
}

/* eslint camelcase: off  */

async function update({user, repo, only}) {
  let list = await pify(gh.list, gh)({user: 'x-oauth', token: rc['github-token']}, user, repo)

  list = list.filter(r => {
    if (r.prerelease || r.draft) {
      return false
    }

    if (only) {
      const version = r.tag_name.trimStart('v')
      return semver.satisfies(version, only)
    }

    return true
  })

  let queue = []
  for (let release of list) {
    const {tag_name, assets} = release
    const files = assets.map(asset => {
      const {name, browser_download_url, size} = asset
      return {tag: tag_name, name, url: browser_download_url, size}
    })
    queue.push(files)
  }
  queue = queue.flat()

  await pmap(
    queue,
    async ({tag, name, url, size}) => {
      const file = join(__dirname, '../../', 'files', repo, tag, name)
      const {skip} = await dl({file, url, expectSize: size})
      console.log('[download %s]: %s', skip ? 'skip' : 'success', `${repo}/${tag}/${name}`)
    },
    10
  ).catch(e => {
    // debugger
    console.error(e.stack)
    console.log(e)
  })
}
