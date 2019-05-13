const _ = require('lodash')

module.exports = (config, changedDocsByUris) => {
  const docs = _.values(changedDocsByUris)

  const ttl = docs
    .map(config.serialize)
    .join('\n')

  // Deduplicate prefixes
  var [ prefixes, rest ] = ttl
    .split('\n')
    .reduce((data, line) => {
      if (line.trim().startsWith('@prefix')) data[0].push(line.trim())
      else data[1].push(line.trim())
      return data
    }, [[], []])

    const deduplicatedTtl = _.uniq(prefixes).join('\n') + rest.join('\n')
    return dropMultilineBreaks(deduplicatedTtl)
}

const dropMultilineBreaks = str => str.replace(/\n\n/g, '\n')
