WITH 'file:///alldeps.csv' AS url
LOAD CSV WITH HEADERS FROM url AS row
MERGE (p:Project { name:row.name, version:row.version, hash:(row.name+'-'+row.version) })
MERGE (d:Dependency { name:row.dependency, hash:(row.dependency+'-'+row.depversion) })
CREATE (p)-[dep:DEPENDS_ON]->(d)
SET dep.type = row.type, dep.version = row.depversion, dep.versionclean = row.depversionclean, dep.operator = row.depversionoperator
RETURN p
