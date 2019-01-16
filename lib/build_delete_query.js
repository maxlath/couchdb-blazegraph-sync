module.exports = uri => {
  return `CONSTRUCT { <${uri}> ?p ?o . } WHERE { <${uri}> ?p ?o . }`
}
