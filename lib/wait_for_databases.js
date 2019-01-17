global.Promise = require('bluebird')
const breq = require('bluereq')
const { green, yellow, grey } = require('chalk')
const tenMinutes = 10 * 60 * 1000
var retryDelay = 500

module.exports = config => {
  const { name } = config
  return Promise.all([
    wait(`${name} couchdb`, config.couchdb.host),
    wait(`${name} blazegraph`, config.blazegraph.endpoint)
  ])
}

const wait = (name, url, attempt = 1) => {
  return breq.head(url)
  .then(res => {
    if (res.statusCode !== 200) {
      throw new Error(`wrong status code: ${res.statusCode}`)
    } else {
      console.warn(green(`${name} is ready`))
    }
  })
  .catch(err => {
    console.warn(yellow(`waiting for ${name}`), grey(`attempt: ${attempt}`), err.message)
    return retry(name, url, ++attempt)
  })
}

const retry = (...args) => {
  return Promise.resolve()
  .delay(getRetryDelay())
  .then(wait.bind(null, ...args))
}

const getRetryDelay = () => {
  if (retryDelay < tenMinutes) retryDelay = retryDelay * 2
  return retryDelay
}
