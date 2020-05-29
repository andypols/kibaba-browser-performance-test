# kibaba-browser-performance-test

Experiment to use elastic beats to monitor chrome browser performance

Using:

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
