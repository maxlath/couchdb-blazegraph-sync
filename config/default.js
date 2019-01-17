module.exports = {
  couchdb: {
    host: 'http://username:password@localhost:5984',
    database: 'my-db'
  },
  blazegraph: {
    host: 'http://localhost:8080',
    namespace: 'kb'
  },
  serializer: {
    workingDir: '/path/to/ttl_serializer/working_dir',
    path: '/path/to/ttl_serializer.js',
    prefixes: '/path/to/prefixes.ttl'
  },
  buildUri: doc => `http://inventaire.io/entity/${doc._id}`
}
