const follow = require('follow')
const { red, green, grey } = require('chalk')
const update = require('./update')
const lastSeq = require('./last_seq')
const logDatabaseDiff = require('./log_database_diff')

module.exports = (name, config) => {
  follow({
    db: config.couchdb.endpoint,
    filter: filterOutDesignDocs,
    include_docs: true,
    since: lastSeq.get(name),
  }, onChange(name, config))

  setInterval(logDatabaseDiff.bind(null, config), 60000)
  logDatabaseDiff(config)
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
