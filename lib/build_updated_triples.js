const serialize = require('./serialize')

module.exports = doc => {
  if (doc.redirect) return ''
  return serialize(doc)
}
