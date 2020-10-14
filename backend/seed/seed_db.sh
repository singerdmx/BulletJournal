#!/bin/sh

BASEDIR=$(dirname "$0")
echo "$BASEDIR"

mkdir -p "$HOME/docker/volumes/db_backup"

docker exec $(sudo docker ps -aqf "name=db") psql -U postgres -c "DROP SCHEMA public,template CASCADE;"
docker exec $(sudo docker ps -aqf "name=db") psql -U postgres -c "CREATE SCHEMA public;"
docker exec $(sudo docker ps -aqf "name=db") psql -U postgres -c "CREATE SCHEMA template;"

rm $HOME/docker/volumes/db_backup/db.gz

cp $BASEDIR/db.gz $HOME/docker/volumes/db_backup/db.gz

docker exec $(sudo docker ps -aqf "name=db") sh -c "gunzip -c /var/db_backup/db.gz | psql  --dbname=postgresql://postgres:docker@localhost:5432/postgres"

