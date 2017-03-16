docker run \
    --publish=7474:7474 --publish=7687:7687 \
    --volume=$HOME/Projects/misc/deps/data:/data \
    --volume=$HOME/Projects/misc/deps/csv:/var/lib/neo4j/import \
    --env NEO4J_AUTH=none \
    neo4j:3.1
