const follow = require('follow')
const { red, green, grey } = require('chalk')
const update = require('./update')
const lastSeq = require('./last_seq')

module.exports = (name, config) => {
  const { host, database } = config.couchdb
  follow({
    db: `${host}/${database}`,
    filter: filterOutDesignDocs,
    include_docs: true
  }, onChange(name, config))
}

const onChange = (name, config) => (err, change) => {
  if (err) return console.error(red(`${name} follow error`), err)

  if (change.seq <= lastSeq.get(name)) {
    console.log(grey(`${name} change before last known seq, passing`), change.seq)
    return
  }

  lastSeq.update(name, change.seq)

  update(config, change)
  .get('body')
  .then(console.log.bind(null, green(`${name} update`)))
  .catch(console.error.bind(null, red(`${name} update error`)))
}

const filterOutDesignDocs = doc => !doc._id.match(/^_design\//)
