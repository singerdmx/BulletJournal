#!/bin/sh
docker-compose -f docker-compose.yml -f ../elk/docker-compose-prod.yml down

