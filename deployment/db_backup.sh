#!/bin/sh
mkdir -p /var/db_backup

dbContainerId=$(sudo docker ps -aqf "name=db")

timestamp=$(date +"%F-%T")

docker exec -it $dbContainerId sh -c "mkdir -p /var/lib/postgresql/data/backup; pg_dumpall --clean --dbname=postgresql://postgres:docker@localhost:5432/postgres | gzip > /var/db_backup/db_$timestamp.gz"

