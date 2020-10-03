#!/bin/sh

git pull
git reset --hard
echo -e '\n==>step 1 / 2: create data volume mount points'
mkdir -p "$HOME/docker/volumes/postgres"
mkdir -p "$HOME/docker/volumes/log"
mkdir -p "$HOME/docker/volumes/etc/key"
mkdir -p "$HOME/docker/volumes/elasticsearch"
mkdir -p "$HOME/docker/auth_proxy/bin"
mkdir -p "$HOME/docker/auth_proxy/log"
mkdir -p "$HOME/docker/daemon/log"

./db_backup.sh

echo -e '\n==>step 2 / 2: docker-compose up -d'
docker-compose -f docker-compose.yml -f ../elk/docker-compose-prod.yml up -d
