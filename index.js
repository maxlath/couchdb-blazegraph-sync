#!/usr/bin/env node
const { red, yellow } = require('chalk')
const configs = require('./lib/configs')
const waitForDatabases = require('./lib/wait_for_databases')
const followChanges = require('./lib/follow_changes')

const init = config => {
  waitForDatabases(config)
  .then(() => followChanges(config))
  .catch(console.error.bind(null, red(`${config.name} init error`)))
}

Object.keys(configs).forEach(name => {
  const config = configs[name]
  if (config.disabled) return console.log(yellow(`${name} is disabled`))
  config.name = name
  init(config)
})
