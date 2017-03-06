WITH 'https://data.nasa.gov/api/views/gh4g-9sfh/rows.csv' AS url
LOAD CSV WITH HEADERS FROM url AS row
CREATE (m:Meteorite { id:row.id, name:row.name, mass:row.mass })
CREATE (c:Classification { class:row.recclass })
CREATE (n)-[b:BELONGS_TO]->(c)
SET b.type=row.recclass
RETURN m LIMIT 10
