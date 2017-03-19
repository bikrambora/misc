////////////////////////////////////////////////
// Projects that depend on a specific library //
////////////////////////////////////////////////
MATCH (d:Dependency)<-[r:DEPENDS_ON]-(p:Project)
WHERE d.name contains "jquery"
RETURN *

///////////////////////////////////////////////////
// Top 5 projects with the most dev dependencies //
//////////////////////////////////////////////////
MATCH (p:Project)-[r:DEPENDS_ON]->(d:Dependency)
WHERE r.type CONTAINS "development"
RETURN p.name as Project, count(r) as `No of dependencies`
ORDER BY count(r) DESC LIMIT 5

///////////////////////////////////////////////////
// Projects with the most dev dependencies //
//////////////////////////////////////////////////
MATCH (p:Project)-[r:DEPENDS_ON { operator: 'fixed' }]->(d:Dependency)
WHERE d.name = "dependency"
RETURN p, d
