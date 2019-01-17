const qs = require('querystring')

module.exports = uri => {
  return qs.escape(`CONSTRUCT { <${uri}> ?p ?o . } WHERE { <${uri}> ?p ?o . }`)
}
