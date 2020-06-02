# Kibana browser performance test

An experiment using Kibana to monitor Chrome browser performance as part of application testing.

Contains a dockerised version of Kibana `7.7.0` and a chrome browser extension that sends cpu, memory and network data to Kibana.

| Name                                                    | Version       |
| ------------------------------------------------------- | ------------- |
| [Elasticsearch](https://www.elastic.co/elasticsearch/)  | 7.7.0         |
| [Kibana](https://www.elastic.co/kibana)                 | 7.7.0         |


## 1. Spin up Kibana
 
``` bash
docker-compose up
```

Kibana can be accessed from [http://localhost:5601/](http://localhost:5601/)

Elastic can be accessed from [http://localhost:9200/](http://localhost:9200/)

## 2. Add the data mappings to Elasticsearch 

Before we can send the performance data to Elasticsearch, we must set up the field [mappings](https://www.elastic.co/guide/en/elasticsearch/reference/7.7/mapping.html).

Not sure we do...

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


curl -H 'Content-Type: application/json' -XPOST 'http://localhost:9200/_bulk?pretty' --data-binary @cpu.json
curl -H 'Content-Type: application/json' -XPOST 'http://localhost:9200/_bulk?pretty' --data-binary @cpu.json


curl -X PUT "localhost:9200/_bulk?pretty" -H 'Content-Type: application/json' -d'
{"index":{"_index":"browser-cpu"}
{"@timestamp":"2020-06-02T09:55:36.344Z","browser":"Andys Chrome","cpu":{"core":{"0":{"idle":66.4524385333665,"kernel":19.731300132246975,"user":13.816261334386523},"1":{"idle":96.32418649608579,"kernel":2.1017797464083636,"user":1.5740337575058474},"2":{"idle":74.63728882336078,"kernel":12.51615010090429,"user":12.846561075734925},"3":{"idle":96.80778762696056,"kernel":1.730222819119364,"user":1.4619895539200727},"4":{"idle":79.0478063070187,"kernel":9.425136032758996,"user":11.527057660222297},"5":{"idle":97.01167597252753,"kernel":1.4994622794904222,"user":1.488861747982052},"6":{"idle":81.92025450350843,"kernel":7.600482608319009,"user":10.479262888172562},"7":{"idle":97.09437068872414,"kernel":1.335410886122048,"user":1.5702184251538145}}}}
'