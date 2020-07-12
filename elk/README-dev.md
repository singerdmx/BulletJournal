# Development cheatsheet
## Start 
```
docker-compose -f ./backend/docker-compose.yml -f ./elk/docker-compose.yml up -d
```

# Stop logstash and create mappings and 

```
docker stop {logstash_id}

docker rm {logstash_id}

curl --user elastic:changeme -XDELETE "http://localhost:9200/project_items"

curl --user elastic:changeme -XPUT "http://localhost:9200/project_items" -H 'Content-Type: application/json' -d @/$HOME/BulletJournal/elk/ProjectItemsIndexMapping.json

curl --user elastic:changeme -XGET "http://localhost:9200/project_items/_mapping"

docker-compose -f ./backend/docker-compose.yml -f ./elk/docker-compose.yml up -d
```


# Go http://localhost:5601/app/kibana#/dev_tools/console

```
GET /project_items/_search
{
  "query": {
    "match_all": {}
  }
}
```