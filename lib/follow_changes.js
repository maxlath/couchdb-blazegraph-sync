const follow = require('follow')
const { red, green, grey } = require('chalk')
const update = require('./update')
const lastSeq = require('./last_seq')

module.exports = (name, config) => {
  const { host, database } = config.couchdb
  follow({
    db: `${host}/${database}`,
    filter: filterOutDesignDocs,
    include_docs: true,
    since: lastSeq.get(name),
  }, onChange(name, config))
}

const onChange = function (name, config) {
  var concurrent = 0
  var paused = false
  return function (err, change) {
    if (err) return console.error(red(`${name} follow error`), err)

    const { seq } = change

    if (seq <= lastSeq.get(name)) {
      console.log(grey(`${name} change before last known seq, passing`), seq)
      return
    }

    lastSeq.update(name, seq)

    if (++concurrent >= 5) {
      this.pause()
      paused = true
      console.log(grey(`${name} paused`), { seq })
    }

    update(config, change)
    .get('body')
    .then(console.log.bind(null, green(`${name} update (seq: ${seq})`)))
    .then(() => {
      if (--concurrent < 5) {
        this.resume()
        paused = false
        console.log(grey(`${name} resume`))
      }
    })
    .catch(console.error.bind(null, red(`${name} update error`)))
  }
}

const filterOutDesignDocs = doc => !doc._id.match(/^_design\//)
