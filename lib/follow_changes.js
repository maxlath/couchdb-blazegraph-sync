const follow = require('follow')
const { red, green } = require('chalk')
const update = require('./update')
const lastSeq = require('./last_seq')
const logDatabaseDiff = require('./log_database_diff')
const { throttle } = require('lodash')
const cancelBlockingQuery = require('./cancel_blocking_query')

module.exports = (name, config) => {
  follow({
    db: config.couchdb.endpoint,
    filter: filterOutDesignDocs,
    include_docs: true,
    since: lastSeq.get(name)
  }, onChange(name, config))
}

const onChange = function (name, config) {
  const lazyDiffLog = throttle(logDatabaseDiff.bind(null, config), 60000)
  lazyDiffLog()

  return function (err, change) {
    if (err) return console.error(red(`${name} follow error`), err)

    lazyDiffLog()

    const feed = this
    const { seq } = change
    feed.pause()

    const tryIt = () => {
      return update(config, change)
      .timeout(5000)
      .get('body')
      .then(body => {
        lastSeq.update(name, seq)
        console.log(green(`${name} update (seq: ${seq})`), body)
        setTimeout(feed.resume.bind(feed), 100)
      })
      .catch(err => {
        if (err.name !== 'TimeoutError') throw err
        return cancelBlockingQuery(config)
        .delay(100)
        .then(tryIt)
      })
      .catch(err => {
        console.error(red(`${name} update error (retrying)`), err, change.seq)
        // Retrying until the change can be successfully saved
        setTimeout(tryIt, 2000)
      })
    }

    return tryIt()
  }
}

const filterOutDesignDocs = doc => !doc._id.match(/^_design\//)
