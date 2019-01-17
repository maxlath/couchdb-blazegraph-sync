// This config example will be ignored: copy in another file to use
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
    // A serializer function to convert a CouchDB doc into triples to be inserted
    path: '/path/to/ttl_serializer.js',
    // optional
    workingDir: '/path/to/ttl_serializer/working_dir',
    // optional
    prefixes: '/path/to/prefixes.ttl'
    // URI required
    buildUri: doc => `http://example.org/entity/${doc._id}`
  }
}