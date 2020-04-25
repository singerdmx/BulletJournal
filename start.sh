#!/bin/sh

echo -e '\n==>step 1 / 2: create data volume mount points'
mkdir -p "$HOME/docker/volumes/postgres"
mkdir -p "$HOME/docker/volumes/log"
mkdir -p "$HOME/docker/volumes/elasticsearch"
mkdir -p "$HOME/docker/volumes/db_backup"

echo -e '\n==>step 2 / 2: docker-compose up -d'

if [ "$#" -ne 0 -a "$1" == "elk" ]; then
    docker-compose -f ./docker-compose.yml -f ./elk/docker-compose.yml up -d
else
    docker-compose -f ./docker-compose.yml up -d
fi
