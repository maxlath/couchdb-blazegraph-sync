const breq = require('bluereq')
const { yellow, green } = require('chalk')

module.exports = config => {
  const tryIt = () => {
    console.error(yellow(`${config.name} fetching blocking queries ids`))
    return getRunningQueryIds(config)
    .then(queryIds => {
      if (queryIds.length === 0) return
      console.log(yellow('running queries'), queryIds)
      return Promise.all(queryIds.map(cancelQuery(config)))
    })
  }

  return tryIt()
}

const getRunningQueryIds = config => {
  return breq.get({
    url: `${config.blazegraph.host}/bigdata/status?showQueries=details`,
    json: false
  })
  .get('body')
  .then(body => {
    const matches = body.match(/queryId=[0-9a-f\-]+/g)
    if (!matches) return []
    return matches.map(match => match.replace('queryId=', ''))
  })
}

const cancelQuery = config => queryId => {
  console.log(yellow('trying to cancel'), queryId)
  return breq.post({
    url: `${config.blazegraph.endpoint}?cancelQuery&queryId=${queryId}`,
    json: false
  })
  .get('body')
  .then(console.log.bind(null, green(`cancelled query ${queryId}`)))
}
