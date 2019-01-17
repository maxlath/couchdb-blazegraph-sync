global.Promise = require('bluebird')
const breq = require('bluereq')
const { couchdb, blazegraph } = require('config')
const { green, yellow, grey } = require('chalk')

module.exports = () => {
  return Promise.all([
    wait('couchdb', couchdb.host, 200),
    wait('blazegraph', blazegraph.endpoint(), 200),
  ])
}

const wait = (name, url, statusCode, attempt = 0) => {
  return breq.head(url)
  .then(res => {
    if (res.statusCode !== statusCode) {
      throw new Error(`wrong status code (expected ${statusCode}, got ${res.statusCode}`)
    } else {
      console.warn(green(`${name} is ready`))
    }
  })
  .catch(err => {
    console.warn(yellow(`waiting for ${name}`), grey(`attempt: ${attempt}`))
    return retry(name, url, statusCode, ++attempt)
  })
}

const retry = (...args) => {
  return Promise.resolve()
  .delay(3000)
  .then(wait.bind(null, ...args))
}
