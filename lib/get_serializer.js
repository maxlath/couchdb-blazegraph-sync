const { readFileSync } = require('fs')
const cwd = process.cwd()

module.exports = config => {
  const { workingDir, path, prefixes: prefixesPath } = config.serializer

  // Allow to require coffee-script files
  // cf https://stackoverflow.com/a/4769079
  if (path.match(/\.coffee$/)) require('coffee-script/register')

  if (workingDir) process.chdir(workingDir)

  const serializer = require(path)

  var prefixes
  if (prefixesPath) prefixes = readFileSync(prefixesPath).toString()
  else prefixes = ''

  if (workingDir) process.chdir(cwd)

  return doc => `${prefixes}
${serializer(doc)}
`
}
