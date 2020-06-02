# Kibana browser performance test

An experiment using Kibana to monitor Chrome browser performance as part of application testing.

Contains a dockerised version of Kibana `7.7.0` and a chrome browser extension that sends cpu, memory and network data to Kibana.


## 1. Spin up Kibana
 
``` bash
docker-compose up
```

Kibana can be accessed from [http://localhost:5601/](http://localhost:5601/)

Elastic can be accessed from [http://localhost:9200/](http://localhost:9200/)

## 2. Add the data mappings to Elasticsearch 

Before we can send the performance data to Elasticsearch, we must set up the field [mappings](https://www.elastic.co/guide/en/elasticsearch/reference/7.7/mapping.html).

Not sure we do...

```
curl -X PUT "localhost:9200/browser-performance?pretty" -H 'Content-Type: application/json' -d'
{
  "mappings": {
    "properties": {
      "geo": {
        "properties": {
          "coordinates": {
            "type": "geo_point"
          }
        }
      }
    }
  }
}
'
```

## 3 Configure the Chrome Extension

The chrome-extension must have permission to post to Kibana.  It's currently configured to post to ```http://localhost/``` in the extensions ```manifest.json```. Change this if you run kibana on a different server.

## Handy docker commands

* `docker ps -aq -f status=exited` ~ list all your stopped containers using
* `docker rm $(docker ps -aq -f status=exited)` ~ remove all your stopped containers
* `docker rm $(docker ps -a -q)` ~ remove all containers
* `docker volume ls` ~ view all volumes
* `docker volume prune` ~ remove unused volumes

## Handy Elastic links and commands

* ```http://localhost:9200/_cat/indices?v``` - see status, size doc-count of all indexes.
* ```curl -X DELETE http://localhost:9200/browser-cpu``` - remove cpu index

## Refs

* https://github.com/ypereirareis/docker-metricbeat-example - inspired by 
* https://github.com/stephen-fox/chrome-docker
* https://www.elastic.co/guide/en/elastic-stack-get-started/current/get-started-docker.html
* https://github.com/pawankt/processbeat
* https://developer.chrome.com/extensions/api_index
* https://developer.chrome.com/extensions/getstarted - info on loading extension
* https://github.com/beaufortfrancois/cog-chrome-app/blob/master/src/main.js
* https://gist.github.com/fletcherist/69a396df380355e49695ecb2fa71e84f
* https://www.elastic.co/guide/en/kibana/current/tutorial-build-dashboard.html
* https://www.elastic.co/guide/en/kibana/current/tutorial-discovering.html
