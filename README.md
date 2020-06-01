# Kibana browser performance test

An experiment using Kibana to monitor Chrome browser performance as part of application testing.

Contains a dockerised version of Kibana `7.7.0` and a chrome browser extension that sends cpu, memory and network data ****to Kibana.

| Name                                                    | Version       |
| ------------------------------------------------------- | ------------- |
| [Elasticsearch](https://www.elastic.co/elasticsearch/)  | 7.7.0         |
| [Kibana](https://www.elastic.co/kibana)                 | 7.7.0         |


## Spin up Kibana
 
``` bash
docker-compose up
```

Kibana can be accessed from [http://localhost:5601/](http://localhost:5601/)

## Handy docker commands

* `docker ps -aq -f status=exited` ~ list all your stopped containers using
* `docker rm $(docker ps -aq -f status=exited)` ~ remove all your stopped containers
* `docker rm $(docker ps -a -q)` ~ remove all containers
* `docker volume ls` ~ view all volumes
* `docker volume prune` ~ remove unused volumes

## Refs

* https://github.com/ypereirareis/docker-metricbeat-example - inspired by 
* https://github.com/stephen-fox/chrome-docker
* https://www.elastic.co/guide/en/elastic-stack-get-started/current/get-started-docker.html
* https://github.com/pawankt/processbeat
* https://developer.chrome.com/extensions/api_index
* https://developer.chrome.com/extensions/getstarted - info on loading extension
* https://github.com/beaufortfrancois/cog-chrome-app/blob/master/src/main.js
* https://gist.github.com/fletcherist/69a396df380355e49695ecb2fa71e84f