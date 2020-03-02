const {join} = require('path')
const dl = require('dl-vampire')
const gh = require('ghreleases')
const config = require('../config')
const rc = require('rc')('prebuild-binary')
const pify = require('promise.ify')
const pmap = require('promise.map')

module.exports = {
  command: 'update [name]',
  alias: ['u'],
  describe: 'update the package',
  async handler(argv) {
    const name = argv.name
    update(name)
  },
}

/* eslint camelcase: off  */

async function update(packageName) {
  const list = await pify(gh.list, gh)(
    {user: 'x-oauth', token: rc['github-token']},
    'magicdawn',
    packageName
  )

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
      const file = join(__dirname, '../../', 'files', packageName, tag, name)
      const {skip} = await dl({file, url, expectSize: size})
      console.log('[download %s]: %s', skip ? 'skip' : 'success', `${packageName}/${tag}/${name}`)
    },
    10
  ).catch(e => {
    // debugger
    console.error(e.stack)
    console.log(e)
  })
}
