const fs = require('fs')
const assert = require('./assert')
const getSerializer = require('./get_serializer')
const get = require('lodash.get')

const getConfig = (filename, name) => {
  const config = require(`../configs/${filename}`)
  validateConfig(config, filename)
  const { couchdb, blazegraph } = config
  couchdb.endpoint = `${couchdb.host}/${couchdb.database}`
  blazegraph.endpoint = `${blazegraph.host}/bigdata/namespace/${blazegraph.namespace}/sparql`
  config.serialize = getSerializer(config)
  config.name = name
  return config
}

const removeExtension = filename => filename.replace(/\.js$/, '')

const schema = {
  'couchdb': { type: 'object' },
  'couchdb.host': { type: 'string' },
  'couchdb.database': { type: 'string' },
  'blazegraph': { type: 'object' },
  'blazegraph.host': { type: 'string' },
  'blazegraph.namespace': { type: 'string' },
  'serializer': { type: 'object' },
  'serializer.path': { type: 'string' },
  'serializer.workingDir': { type: 'string', optional: true },
  'serializer.prefixes': { type: 'string', optional: true },
  'serializer.buildUri': { type: 'function' }
}

const validateConfig = (config, filename) => {
  Object.keys(schema).forEach(key => {
    const { type, optional } = schema[key]
    const value = get(config, key)
    try {
      if (value == null && optional) return
      assert[type](value)
    } catch (err) {
      const context = `expected type ${type}, got ${value}`
      throw new Error(`invalid config key in ${filename}: ${key} (${context})`)
    }
  })
}

module.exports = fs.readdirSync('./configs')
  .filter(filename => filename !== 'example.js')
  .reduce((index, filename) => {
    const name = removeExtension(filename)
    index[name] = getConfig(filename, name)
    return index
  }, {})
