#!/usr/bin/env node
const { red } = require('chalk')
const configs = require('./lib/configs')
const waitForDatabases = require('./lib/wait_for_databases')
const followChanges = require('./lib/follow_changes')

const init = (name, config) => {
  waitForDatabases(config)
  .then(() => followChanges(name, config))
  .catch(console.error.bind(null, red(`${name} init error`)))
}

Object.keys(configs).forEach(name => {
  const config = configs[name]
  init(name, config)
})
