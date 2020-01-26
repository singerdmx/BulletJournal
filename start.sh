#!/bin/sh

echo -e '\n==>step 1 / 2: create data volume mount points'
mkdir -p "$HOME/docker/volumes/postgres"

echo -e '\n==>step 2 / 2: docker-compose up -d'
docker-compose up -d

