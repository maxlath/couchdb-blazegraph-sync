#!/usr/bin/env node
const { couchdb } = require('config')
const { red } = require('chalk')
const waitForDatabases = require('./lib/wait_for_databases')
const followChanges = require('./lib/follow_changes')

waitForDatabases()
.then(followChanges)
.catch(console.error.bind(null, red('init error')))
