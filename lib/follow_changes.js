const follow = require('follow')
const { red, green } = require('chalk')
const update = require('./update')
const lastSeq = require('./last_seq')
const logDatabaseDiff = require('./log_database_diff')
const { throttle } = require('lodash')
const cancelBlockingQuery = require('./cancel_blocking_query')
// Setting the length to high will trigger a '414 URI Too Long' error
const bulkUpdateLength = 100
const debounceDelay = 10000

module.exports = config => {
  const { name } = config
  follow({
    db: config.couchdb.endpoint,
    filter: filterOutDesignDocs,
    include_docs: true,
    since: lastSeq.get(name)
  }, onChange(config))
}

const onChange = function (config) {
  const { name } = config
  const lazyDiffLog = throttle(logDatabaseDiff.bind(null, config), 60000)
  lazyDiffLog()


  return function (err, change) {
    if (err) return console.error(red(`${name} follow error`), err)


    lazyDiffLog()

    const feed = this
    const { seq } = change

    if (!config._changes) config._changes = []
    config._changes.push(change)
    config._lastSeq = seq

    const pauseFeedAndUpdate = () => {
      feed.pause()
      changes = config._changes
      config._changes = []
      insistentUpdate(config, changes, feed, seq)
    }

    clearTimeout(config._lastDebounceTimeout)

    if (config._changes.length >= bulkUpdateLength) {
      pauseFeedAndUpdate()
    } else {
      config._lastDebounceTimeout = setTimeout(pauseFeedAndUpdate, debounceDelay)
    }
  }
}

const insistentUpdate = (config, changes, feed, seq) => {
  const { name } = config
  var attempts = 0

  const tryToUpdate = () => {
    return update(config, changes)
    .timeout(5000)
    .get('body')
    .then(body => {
      lastSeq.update(name, seq)
      console.log(green(`${name} update (seq: ${seq})`), body)
      // Give some time to breath to BlazeGraph
      setTimeout(feed.resume.bind(feed), 2000)
    })
    .catch(err => {
      if (err.name !== 'TimeoutError') throw err
      return cancelBlockingQuery(config)
      .delay(1000)
      .then(tryToUpdate)
    })
    .catch(err => {
      const timeoutSeconds = ++attempts * 2
      console.error(red(`${name} update error (retrying ${timeoutSeconds}s)`), err, seq)
      // Retrying until the change can be successfully saved
      setTimeout(tryToUpdate, timeoutSeconds * 1000)
    })
  }

  return tryToUpdate()
}

const filterOutDesignDocs = doc => !doc._id.match(/^_design\//)
