Before running logstash, need to create index mapping:
```
curl --user elastic:changeme -XPUT "http://localhost:9200/project_items" -' -d'{tent-Type: application/json'
  "mappings": {
    "properties": {
      "@timestamp": {
        "type": "date"
      },
      "groupId": {
        "type": "keyword"
      },
      "id": {
        "type": "keyword"
      },
      "type": {
        "type": "keyword"
      },
      "value": {
        "type": "text",
        "analyzer": "standard",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "parentId": {
        "type": "keyword"
      }
    }
  }
}'
```