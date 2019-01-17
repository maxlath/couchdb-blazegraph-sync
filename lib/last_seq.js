const debounce = require('lodash.debounce')
const fs = require('fs')
const { red, grey } = require('chalk')
const map = require('lodash.map')
const configsNames = map(require('./configs'), 'name')
const getPath = name => `./data/${name}.last_seq`

const getInitialLastSeq = name => {
  try {
    return parseInt(fs.readFileSync(getPath(name)).toString())
  } catch (err) {
    if (err.code === 'ENOENT') return 0
    else throw err
  }
}

const lastSeqs = configsNames.reduce((index, name) => {
  index[name] = getInitialLastSeq(name)
  console.log(grey(`${name} initial last seq`), index[name])
  return index
}, {})


const updateLastSeq = name => seq => {
  if (seq <= lastSeqs[name]) return
  lastSeqs[name] = seq
  fs.writeFile(getPath(name), lastSeqs[name], (err, res) => {
    if (err) return console.error('update_last_seq error')
    console.log(grey('updated last seq'), lastSeqs[name])
  })
}

const debouncedUpdaters = configsNames.reduce((index, name) => {
  index[name] = debounce(updateLastSeq(name), 2000)
  return index
}, {})

module.exports = {
  get: name => lastSeqs[name],
  update: (name, lastSeq) => debouncedUpdaters[name](lastSeq)
}
