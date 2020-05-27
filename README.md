# kibaba-browser-performance-test

Experiment to use elastic beats to monitor chrome browser performance

Using:

| Name           | Version       |
| -------------- | ------------- |
| Elasticsearch  | 7.7.0         |
| Kibana         | 7.7.0         |


``` bash
docker network create metricbeat
docker-compose up -d kibana
```

Kibana can be accessed from ```http://localhost:5601/```

## Handy docker commands

* `docker ps -aq -f status=exited` ~ List all your stopped containers using
* `docker rm $(docker ps -aq -f status=exited)` ~ Remove all your stopped containers
* `docker rm $(docker ps -a -q)` ~ remove all containers

## Refs

* https://github.com/ypereirareis/docker-metricbeat-example - inspired by 