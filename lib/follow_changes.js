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
  var busy = false
  return function (err, change) {
    if (err) return console.error(red(`${name} follow error`), err)

    const feed = this
    const { seq } = change
    feed.pause()

    const tryIt = () => {
      update(config, change)
      .get('body')
      .then(body => {
        feed.resume()
        lastSeq.update(name, seq)
        console.log(green(`${name} update (seq: ${seq})`), body)
      })
      .catch(err => {
        console.error(red(`${name} update error (retrying)`), err, change)
        // Retrying until the change can be successfully saved
        setTimeout(tryIt, 2000)
      })
    }

    tryIt()
  }
}

const filterOutDesignDocs = doc => !doc._id.match(/^_design\//)
