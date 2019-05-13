const { grey } = require('chalk')
const { map, throttle } = require('lodash')
const configsNames = map(require('./configs'), 'name')
const persistedLastSeq = require('./persisted_last_seq')

const lastSeqs = {}
const lazySave = {}

configsNames.forEach(name => {
  lastSeqs[name] = persistedLastSeq.get(name)
  console.log(grey(`${name} initial last seq`), lastSeqs[name])
  lazySave[name] = throttle(persistedLastSeq.save(lastSeqs, name), 5000)
})

module.exports = {
  get: name => lastSeqs[name],
  update: (name, seq) => {
    if (seq <= lastSeqs[name]) return
    lastSeqs[name] = seq
    lazySave[name]()
  }
}
