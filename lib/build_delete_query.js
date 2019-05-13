const qs = require('querystring')

const multiUrisGraphDelete = uris => {
  uris = uris.map(uri => `<${uri}>`).join(' ')
  return `CONSTRUCT { ?s ?p ?o . } WHERE {
    VALUES ?s { ${uris} }
    ?s ?p ?o .
  }`
}

module.exports = uris => qs.escape(multiUrisGraphDelete(uris))
