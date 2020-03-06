#!/bin/sh
if [ "$#" -ne 0 -a "$1" == "elk" ]; then
    docker-compose -f ./docker-compose.yml -f ./elk/docker-compose.yml down
else
    docker-compose -f ./docker-compose.yml down
fi
