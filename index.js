#!/usr/bin/env node
const { couchdb } = require('config')
const follow = require('follow')
const { red, green } = require('chalk')
const db = `${couchdb.host}/${couchdb.database}`
const update = require('./lib/update')

const filterOutDesignDocs = doc => !doc._id.match(/^_design\//)

follow({ db, filter: filterOutDesignDocs, include_docs: true }, (err, change) => {
  if (err) return console.error(red('follow error'), err)

  update(change)
  .get('body')
  .then(console.log.bind(null, green('RES')))
  .catch(console.error.bind(null, red('ERR')))
})
