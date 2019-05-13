const breq = require('bluereq')
const buildDeleteQuery = require('./build_delete_query')
const getUpdatedTripes = require('./get_updated_tripes')
const headers = {
  'Content-Type': 'application/x-turtle'
}

module.exports = (config, changes) => {
  const changedDocsByUris = buildDeduplicatedIndex(config, changes)
  const uris = Object.keys(changedDocsByUris)
  console.log({ changes: changes.length, uris: uris.length })
  const query = buildDeleteQuery(uris)
  const updatedTriples = getUpdatedTripes(config, changedDocsByUris)

  // See: https://wiki.blazegraph.com/wiki/index.php/REST_API#UPDATE_.28DELETE_.2B_INSERT.29
  const url = `${config.blazegraph.endpoint}?query=${query}`
  const body = updatedTriples

  return breq.put({ url, json: false, headers, body })
}

// Keep the latest doc version for each doc
const buildDeduplicatedIndex = (config, changes) => {
  return changes.reduce((index, change) => {
    const { doc } = change
    const uri = config.serializer.buildUri(doc)
    index[uri] = doc
    return index
  }, {})
}
