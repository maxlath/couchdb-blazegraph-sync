module.exports = {
  object: obj => {
    if (typeof obj !== 'object') throw new Error(`expected object, got ${typeof obj}`)
    if (obj === null) throw new Error(`expected object, got null`)
    if (obj instanceof Array) throw new Error(`expected object, got array`)
  },
  string: str => {
    if (typeof str !== 'string') throw new Error(`expected string, got ${typeof str}`)
  },
  function: fn => {
    if (typeof fn !== 'function') throw new Error(`expected function, got ${typeof fn}`)
  }
}
