const breq = require('bluereq')
const chalk = require('chalk')
const { green } = chalk
const lastSeq = require('./last_seq')

module.exports = config => {
  const { name } = config
  const lastKnownSeq = lastSeq.get(name)
  breq.get(config.couchdb.endpoint)
  .then(res => {
    const databaseLastSeq = res.body['update_seq']
    const diff = databaseLastSeq - lastKnownSeq
    if (diff === 0) {
      console.log(green(`${name} databases are in sync`))
    } else {
      const color = pickColor(diff)
      console.log(chalk[color](`${name} is late by ${diff} seq`))
    }
  })
}

const pickColor = diff => {
  if (diff > 10000) return 'red'
  if (diff > 100) return 'yellow'
  return 'blue'
}
