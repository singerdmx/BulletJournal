Before running logstash, need to create index mapping:
```
curl --user elastic:changeme -XDELETE "http://localhost:9200/project_items"

curl --user elastic:changeme -XPUT "http://localhost:9200/project_items" -H 'Content-Type: application/json' -d @/root/ws/BulletJournal/elk/ProjectItemsIndexMapping.json

curl --user elastic:changeme -XGET "http://localhost:9200/project_items/_mapping"
```

## build image for logstash
```
cd logstash
docker build -t mwangxx/logstash:7.6.0 .
```