const breq = require('bluereq')
const buildDeleteQuery = require('./build_delete_query')

// See: https://wiki.blazegraph.com/wiki/index.php/REST_API#UPDATE_.28DELETE_.2B_INSERT.29
module.exports = (config, change) => {
  const { doc } = change
  const uri = config.serializer.buildUri(doc)
  const query = buildDeleteQuery(uri)
  const updatedTriples = config.serialize(doc)
  return breq.put({
    url: `${config.blazegraph.endpoint}?query=${query}`,
    headers: {
      'Content-Type': 'application/x-turtle'
    },
    body: updatedTriples
  })
}
