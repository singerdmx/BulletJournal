Before running logstash, need to create index mapping:
```
curl -XPUT "http://localhost:9200/project_items" -H 'Content-Type: application/json' -d'{  "mappings": {    "properties": {      "@timestamp": {        "type": "date"      },      "group_id": {        "type": "keyword"      },      "id": {        "type": "keyword"      },      "type": {        "type": "keyword"      },      "value": {        "type": "text",        "fields": {          "keyword": {            "type": "keyword"          }        }      },      "parent_id": {        "type": "keyword"      }    }  }}'
```