# kibaba-browser-performance-test

Experiment to use elastic beats to monitor chrome browser performance

Using:

| Name           | Version       |
| -------------- | ------------- |
| Elasticsearch  | 7.0.0         |


``` bash
docker network create metricbeat
docker-compose up -d kibana
```

## Refs

* https://github.com/ypereirareis/docker-metricbeat-example - inspired by 