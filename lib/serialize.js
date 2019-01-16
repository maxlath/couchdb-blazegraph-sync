const cwd = process.cwd()
const { workingDir, path, prefixes: prefixesPath } = require('config').serializer
const { readFileSync } = require('fs')

// Allow to require coffee-script files
// cf https://stackoverflow.com/a/4769079
if (path.match(/\.coffee$/)) require('coffee-script/register')

if (workingDir) process.chdir(workingDir)

const serializer = require(path)
var prefixes
if (prefixesPath) prefixes = readFileSync(prefixesPath).toString()
else prefixes = ''

if (workingDir) process.chdir(cwd)

// module.exports = doc => `${prefixes}
// ${serializer(doc)}
// `

module.exports = serializer