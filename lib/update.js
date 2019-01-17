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
  const updatedTriples = buildUpdatedTriples(doc)

  console.log(blue('uri'), uri, buildDeleteQuery(uri))
  const query = qs.escape(buildDeleteQuery(uri))

  console.log(blue('query'), query)
  console.log(blue('updatedTriples'), updatedTriples)

  return breq.put({
    url: `${endpoint}?query=${query}`,
    headers: {
      'Content-Type': 'application/x-turtle'
    },
    body: updatedTriples
  })
}
