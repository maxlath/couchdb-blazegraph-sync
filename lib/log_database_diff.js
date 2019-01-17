const breq = require('bluereq')
const { green, yellow } = require('chalk')
const lastSeq = require('./last_seq')

module.exports = config => {
  const { name } = config
  const lastKnownSeq = lastSeq.get(name)
  breq.get(config.couchdb.endpoint)
  .then(res => {
    const databaseLastSeq = res.body['update_seq']
    const diff = databaseLastSeq - lastKnownSeq
    if (diff === 0) {
      console.log(green(`${name} databases are in sync (seq: ${lastKnownSeq})`))
    } else {
      console.log(yellow(`${name} is late by ${diff} seq`))
    }
  })
}
