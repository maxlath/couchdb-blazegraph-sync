const debounce = require('lodash.debounce')
const fs = require('fs')
const { red, grey } = require('chalk')
const lastSeqFilePath = './last_seq'

var lastSeq
try {
  lastSeq = parseInt(fs.readFileSync(lastSeqFilePath).toString())
} catch (err) {
  if (err.code === 'ENOENT') lastSeq = 0
  else throw err
}
console.log(grey('initial last seq'), lastSeq)

const updateLastSeq = seq => {
  if (seq <= lastSeq) return
  lastSeq = seq
  fs.writeFile(lastSeqFilePath, lastSeq, (err, res) => {
    if (err) return console.error('update_last_seq error')
    console.log(grey('updated last seq'), lastSeq)
  })
}

module.exports = {
  get: () => lastSeq,
  update: debounce(updateLastSeq, 2000)
}
