#!/bin/sh
mkdir -p /var/db_backup

dbContainerId=$(sudo docker ps -aqf "name=db")

timestamp=$(date +"%F-%T")

docker exec -i $dbContainerId sh -c "mkdir -p /var/db_backup; pg_dumpall --dbname=postgresql://postgres:docker@localhost:5432/postgres | sed 's/CREATE ROLE postgres;/-- CREATE ROLE postgres;/' | gzip > /var/db_backup/db_$timestamp.gz"

