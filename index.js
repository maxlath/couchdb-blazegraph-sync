#!/usr/bin/env node
const { couchdb } = require('config')
const follow = require('follow')
const { red, green, grey } = require('chalk')
const db = `${couchdb.host}/${couchdb.database}`
const update = require('./lib/update')
const lastSeq = require('./lib/last_seq')

const filterOutDesignDocs = doc => !doc._id.match(/^_design\//)

follow({ db, filter: filterOutDesignDocs, include_docs: true }, (err, change) => {
  if (err) return console.error(red('follow error'), err)

  if (change.seq <= lastSeq.get()) {
    console.log(grey('change is before last known seq, passing'), change.seq)
    return
  }

  lastSeq.update(change.seq)

  update(change)
  .get('body')
  .then(console.log.bind(null, green('RES')))
  .catch(console.error.bind(null, red('ERR')))
})
