const { blazegraph, buildUri } = require('config')
const endpoint = blazegraph.endpoint()
const { blue } = require('chalk')
const breq = require('bluereq')
const qs = require('querystring')
const buildUpdatedTriples = require('./build_updated_triples')
const buildDeleteQuery = require('./build_delete_query')

module.exports = change => {
  const { doc } = change
  const uri = buildUri(doc)
  const query = qs.escape(buildDeleteQuery(uri))
  const updatedTriples = buildUpdatedTriples(doc)
  return breq.put({
    url: `${endpoint}?query=${query}`,
    headers: {
      'Content-Type': 'application/x-turtle'
    },
    body: updatedTriples
  })
}
