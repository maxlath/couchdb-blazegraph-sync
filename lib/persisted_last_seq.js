const fs = require('fs')
const { grey } = require('chalk')
const getPath = name => `./data/${name}.last_seq`

module.exports = {
  get: name => {
    try {
      const seq = parseInt(fs.readFileSync(getPath(name)).toString())
      if (typeof seq !== 'number' || Number.isNaN(seq)) {
        throw new Error(`invalid last seq: ${seq}`)
      }
      return seq
    } catch (err) {
      if (err.code === 'ENOENT') return 0
      else throw err
    }
  },

  save: (lastSeqs, name) => () => {
    fs.writeFile(getPath(name), lastSeqs[name], (err, res) => {
      if (err) return console.error('update_last_seq error')
      console.log(grey('updated last seq'), lastSeqs[name])
    })
  }
}
