# Kibana browser performance test monitor

An experiment using [Kibana](https://www.elastic.co/kibana) to monitor Chrome browser performance as part of application testing. 

It contains a dockerised version of Kibana 7.7.0 and a chrome browser extension that sends system cpu, javascript heap usage and websocket frequency data to Kibana.

The extension uses the [chrome devtools-protocol](https://chromedevtools.github.io/devtools-protocol/) to interact with the browsers debugger.

## Instructions

### 1. Spin up Kibana
 
``` bash
docker-compose up
```

Kibana can be accessed from [http://localhost:5601/](http://localhost:5601/)

Elastic can be accessed from [http://localhost:9200/](http://localhost:9200/)

### 2. Add the dashboard to Kibana 

```bash
curl -X POST -H 'Content-Type: application/json' -H 'kbn-xsrf: true' -d @./kibana/dashboard.json http://localhost:5601/api/kibana/dashboards/import
curl -X POST -H 'Content-Type: application/json' -H 'kbn-xsrf: true' -d @./kibana/browsers-dashboard.json http://localhost:5601/api/kibana/dashboards/import
```

You can save any dashboard changes using:

```bash{
  "version": "7.7.0",
  "objects": [
    {
      "id": "213c9c90-a764-11ea-a03d-a10b2b67390e",
      "type": "dashboard",
      "updated_at": "2020-07-06T17:37:05.586Z",
      "version": "WzE2OCw0XQ==",
      "attributes": {
        "title": "Browser Performance",
        "hits": 0,
        "description": "",
        "panelsJSON": "[{\"version\":\"7.7.0\",\"gridData\":{\"h\":15,\"i\":\"c33eae9b-0691-4226-b1b0-91242c39b121\",\"w\":24,\"x\":0,\"y\":0},\"panelIndex\":\"c33eae9b-0691-4226-b1b0-91242c39b121\",\"embeddableConfig\":{},\"panelRefName\":\"panel_0\"},{\"version\":\"7.7.0\",\"gridData\":{\"h\":15,\"i\":\"7b970ac1-4b17-41ad-8f56-0cbd3b527259\",\"w\":24,\"x\":24,\"y\":0},\"panelIndex\":\"7b970ac1-4b17-41ad-8f56-0cbd3b527259\",\"embeddableConfig\":{},\"panelRefName\":\"panel_1\"},{\"version\":\"7.7.0\",\"gridData\":{\"h\":15,\"i\":\"71065ab6-93eb-49be-878c-91155fc1b2ea\",\"w\":24,\"x\":24,\"y\":15},\"panelIndex\":\"71065ab6-93eb-49be-878c-91155fc1b2ea\",\"embeddableConfig\":{},\"panelRefName\":\"panel_2\"},{\"version\":\"7.7.0\",\"gridData\":{\"w\":24,\"h\":15,\"x\":0,\"y\":15,\"i\":\"a09cd653-2110-4475-b85c-c121f18e07e5\"},\"panelIndex\":\"a09cd653-2110-4475-b85c-c121f18e07e5\",\"embeddableConfig\":{},\"panelRefName\":\"panel_3\"}]",
        "optionsJSON": "{\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": false,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"kuery\",\"query\":\"browser : Andy's Browser\"},\"filter\":[]}"
        }
      },
      "references": [
        {
          "name": "panel_0",
          "type": "visualization",
          "id": "ff1441e0-a763-11ea-a03d-a10b2b67390e"
        },
        {
          "name": "panel_1",
          "type": "visualization",
          "id": "4aa2c4c0-ac4a-11ea-983f-95c383cd1db8"
        },
        {
          "name": "panel_2",
          "type": "visualization",
          "id": "c2bf6f20-bfab-11ea-88da-6f4b49288d4a"
        },
        {
          "name": "panel_3",
          "type": "visualization",
          "id": "30004ed0-bfaf-11ea-88da-6f4b49288d4a"
        }
      ],
      "migrationVersion": {
        "dashboard": "7.3.0"
      }
    },
    {
      "id": "ff1441e0-a763-11ea-a03d-a10b2b67390e",
      "type": "visualization",
      "updated_at": "2020-07-01T13:18:19.922Z",
      "version": "WzYsMV0=",
      "attributes": {
        "title": "System CPU %",
        "visState": "{\"type\":\"area\",\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"cpu.kernelPct\",\"customLabel\":\"Kernel %\"}},{\"id\":\"2\",\"enabled\":true,\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"cpu.userPct\",\"customLabel\":\"User %\"}},{\"id\":\"3\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"timeRange\":{\"from\":\"now-30m\",\"to\":\"now\"},\"useNormalizedEsInterval\":true,\"scaleMetricValues\":false,\"interval\":\"auto\",\"drop_partials\":false,\"min_doc_count\":1,\"extended_bounds\":{}}}],\"params\":{\"type\":\"area\",\"grid\":{\"categoryLines\":false},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"filter\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Average cpu.kernelPct\"}}],\"seriesParams\":[{\"show\":true,\"type\":\"area\",\"mode\":\"stacked\",\"data\":{\"label\":\"Kernel %\",\"id\":\"1\"},\"drawLinesBetweenPoints\":true,\"lineWidth\":2,\"showCircles\":true,\"interpolate\":\"linear\",\"valueAxis\":\"ValueAxis-1\"},{\"show\":true,\"type\":\"area\",\"mode\":\"stacked\",\"data\":{\"id\":\"2\",\"label\":\"User %\"},\"drawLinesBetweenPoints\":true,\"lineWidth\":2,\"showCircles\":true,\"interpolate\":\"linear\",\"valueAxis\":\"ValueAxis-1\"}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false,\"thresholdLine\":{\"show\":false,\"value\":10,\"width\":1,\"style\":\"full\",\"color\":\"#E7664C\"},\"labels\":{}},\"title\":\"System CPU %\"}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"
        }
      },
      "references": [
        {
          "name": "kibanaSavedObjectMeta.searchSourceJSON.index",
          "type": "index-pattern",
          "id": "browser-cpu"
        }
      ],
      "migrationVersion": {
        "visualization": "7.7.0"
      }
    },
    {
      "id": "4aa2c4c0-ac4a-11ea-983f-95c383cd1db8",
      "type": "visualization",
      "updated_at": "2020-07-01T13:18:19.922Z",
      "version": "WzcsMV0=",
      "attributes": {
        "title": "Web Socket Messages",
        "visState": "{\"type\":\"line\",\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"timeRange\":{\"from\":\"now-1h\",\"to\":\"now\"},\"useNormalizedEsInterval\":true,\"scaleMetricValues\":false,\"interval\":\"auto\",\"drop_partials\":false,\"min_doc_count\":1,\"extended_bounds\":{}}}],\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"filter\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":true,\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"lineWidth\":2,\"interpolate\":\"linear\",\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false,\"labels\":{},\"thresholdLine\":{\"show\":false,\"value\":10,\"width\":1,\"style\":\"full\",\"color\":\"#E7664C\"}},\"title\":\"Web Socket Messages\"}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"
        }
      },
      "references": [
        {
          "name": "kibanaSavedObjectMeta.searchSourceJSON.index",
          "type": "index-pattern",
          "id": "4df96370-ac42-11ea-983f-95c383cd1db8"
        }
      ],
      "migrationVersion": {
        "visualization": "7.7.0"
      }
    },
    {
      "id": "c2bf6f20-bfab-11ea-88da-6f4b49288d4a",
      "type": "visualization",
      "updated_at": "2020-07-06T17:15:05.302Z",
      "version": "WzE1MSw0XQ==",
      "attributes": {
        "title": "DOM Nodes",
        "visState": "{\"type\":\"area\",\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"performance.domNodes\",\"customLabel\":\"DOM Nodes\"}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"timeRange\":{\"from\":\"now-30m\",\"to\":\"now\"},\"useNormalizedEsInterval\":true,\"scaleMetricValues\":false,\"interval\":\"auto\",\"drop_partials\":false,\"min_doc_count\":1,\"extended_bounds\":{}}}],\"params\":{\"type\":\"area\",\"grid\":{\"categoryLines\":false,\"valueAxis\":\"ValueAxis-1\"},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"filter\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"DOM Nodes\"}}],\"seriesParams\":[{\"show\":true,\"type\":\"area\",\"mode\":\"stacked\",\"data\":{\"label\":\"DOM Nodes\",\"id\":\"1\"},\"drawLinesBetweenPoints\":true,\"lineWidth\":2,\"showCircles\":true,\"interpolate\":\"linear\",\"valueAxis\":\"ValueAxis-1\"}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false,\"thresholdLine\":{\"show\":false,\"value\":10,\"width\":1,\"style\":\"full\",\"color\":\"#E7664C\"},\"labels\":{}},\"title\":\"DOM Nodes\"}",
        "uiStateJSON": "{\"vis\":{\"colors\":{\"DOM Nodes\":\"#7EB26D\"}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"kuery\",\"query\":\"\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"
        }
      },
      "references": [
        {
          "name": "kibanaSavedObjectMeta.searchSourceJSON.index",
          "type": "index-pattern",
          "id": "browser-cpu"
        }
      ],
      "migrationVersion": {
        "visualization": "7.7.0"
      }
    },
    {
      "id": "30004ed0-bfaf-11ea-88da-6f4b49288d4a",
      "type": "visualization",
      "updated_at": "2020-07-06T17:36:13.373Z",
      "version": "WzE2Nyw0XQ==",
      "attributes": {
        "title": "JS heap size",
        "visState": "{\"type\":\"line\",\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"performance.jSHeapUsedSize\",\"customLabel\":\"JS Heap\"}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"timeRange\":{\"from\":\"now-15m\",\"to\":\"now\"},\"useNormalizedEsInterval\":true,\"scaleMetricValues\":false,\"interval\":\"auto\",\"drop_partials\":false,\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"enabled\":true,\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"performance.jSHeapTotalSize\",\"customLabel\":\"JS Heap Size\"}}],\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"filter\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"JS Heap\"}}],\"seriesParams\":[{\"show\":true,\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"JS Heap\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"lineWidth\":2,\"interpolate\":\"linear\",\"showCircles\":true},{\"show\":true,\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"id\":\"3\",\"label\":\"JS Heap Size\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"lineWidth\":2,\"interpolate\":\"linear\",\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false,\"labels\":{},\"thresholdLine\":{\"show\":false,\"value\":10,\"width\":1,\"style\":\"full\",\"color\":\"#E7664C\"}},\"title\":\"JS heap size\"}",
        "uiStateJSON": "{\"vis\":{\"colors\":{\"JS Heap Size\":\"#E5A8E2\",\"JS Heap\":\"#806EB7\"}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"
        }
      },
      "references": [
        {
          "name": "kibanaSavedObjectMeta.searchSourceJSON.index",
          "type": "index-pattern",
          "id": "browser-cpu"
        }
      ],
      "migrationVersion": {
        "visualization": "7.7.0"
      }
    },
    {
      "id": "browser-cpu",
      "type": "index-pattern",
      "updated_at": "2020-07-06T17:38:50.373Z",
      "version": "WzE3Myw0XQ==",
      "attributes": {
        "title": "browser-cpu",
        "timeFieldName": "@timestamp",
        "fields": "[{\"name\":\"@timestamp\",\"type\":\"date\",\"esTypes\":[\"date\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"_id\",\"type\":\"string\",\"esTypes\":[\"_id\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_index\",\"type\":\"string\",\"esTypes\":[\"_index\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_source\",\"type\":\"_source\",\"esTypes\":[\"_source\"],\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_type\",\"type\":\"string\",\"esTypes\":[\"_type\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"browser\",\"type\":\"string\",\"esTypes\":[\"text\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"browser.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"subType\":{\"multi\":{\"parent\":\"browser\"}}},{\"name\":\"cpu.idlePct\",\"type\":\"number\",\"esTypes\":[\"float\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"cpu.kernelPct\",\"type\":\"number\",\"esTypes\":[\"float\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"cpu.userPct\",\"type\":\"number\",\"esTypes\":[\"float\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"heap.jsHeapSizeLimit\",\"type\":\"number\",\"esTypes\":[\"long\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"heap.totalJSHeapSize\",\"type\":\"number\",\"esTypes\":[\"long\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"heap.totalJSHeapSizePct\",\"type\":\"number\",\"esTypes\":[\"float\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"heap.usedJSHeapSize\",\"type\":\"number\",\"esTypes\":[\"long\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"heap.usedJSHeapSizePct\",\"type\":\"number\",\"esTypes\":[\"float\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"performance.domNodes\",\"type\":\"number\",\"esTypes\":[\"long\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"performance.jSHeapTotalSize\",\"type\":\"number\",\"esTypes\":[\"long\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"performance.jSHeapUsedSize\",\"type\":\"number\",\"esTypes\":[\"long\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true}]",
        "fieldFormatMap": "{\"performance.jSHeapTotalSize\":{\"id\":\"bytes\",\"params\":{\"parsedUrl\":{\"origin\":\"http://localhost:5601\",\"pathname\":\"/app/kibana\",\"basePath\":\"\"}}},\"performance.jSHeapUsedSize\":{\"id\":\"bytes\",\"params\":{\"parsedUrl\":{\"origin\":\"http://localhost:5601\",\"pathname\":\"/app/kibana\",\"basePath\":\"\"}}}}"
      },
      "references": [],
      "migrationVersion": {
        "index-pattern": "7.6.0"
      }
    },
    {
      "id": "4df96370-ac42-11ea-983f-95c383cd1db8",
      "type": "index-pattern",
      "updated_at": "2020-07-01T13:18:19.922Z",
      "version": "WzEwLDFd",
      "attributes": {
        "title": "browser-ws",
        "timeFieldName": "@timestamp",
        "fields": "[{\"name\":\"@timestamp\",\"type\":\"date\",\"esTypes\":[\"date\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"_id\",\"type\":\"string\",\"esTypes\":[\"_id\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_index\",\"type\":\"string\",\"esTypes\":[\"_index\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_source\",\"type\":\"_source\",\"esTypes\":[\"_source\"],\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_type\",\"type\":\"string\",\"esTypes\":[\"_type\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"payload\",\"type\":\"number\",\"esTypes\":[\"long\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true}]"
      },
      "references": [],
      "migrationVersion": {
        "index-pattern": "7.6.0"
      }
    }
  ]
}
curl -X GET "localhost:5601/api/kibana/dashboards/export?dashboard=<dashboard-gid>" > your-dashboard.json
``` 


### 3 Add the custom extension to Chrome

The chrome-extension must have permission to post to Kibana. If you change Elastic to run on a specific host, you must update the permissions in the ```manifest.json```.

Build the plugin (into ```dist``` in the ```chrome/extension``` folder):

```bash
cd chrome
yarn start 
``` 

Then:

* Vist ```chrome://extensions/``` in your browser.  
* Toggle the ```Developer mode``` switch on the top right-hand-side.
* Click the ```Load unpacked``` button and and select the ```chrome/extension``` folder.

You should see the ```Kibana system pump (beat)``` extension:
 
![ext](./assets/extension.png)

### 4 Activate the extension to send data to Kibana

Click the extension icon on when viewing the browser tab you want to monitor.  

![ext](./assets/icon.png)

This will display a (very ugly) popup informing you that the extension has control of the debugger along with the data being sent.

You can change the browser name (the name is used to identify and filter the results in Kibana) and the Elastic Search URL (where the data is being sent) by double-clicking on the fields.

### 5 View the data on the Dashboard

The ```Browser Performance``` dashboard can be accessed from [http://localhost:5601/app/kibana#/dashboards](http://localhost:5601/app/kibana#/dashboards)

## Other Stuff

### Handy docker commands

* `docker ps -aq -f status=exited` ~ list all your stopped containers using
* `docker rm $(docker ps -aq -f status=exited)` ~ remove all your stopped containers
* `docker rm $(docker ps -a -q)` ~ remove all containers
* `docker volume ls` ~ view all volumes
* `docker volume prune` ~ remove unused volumes

### Handy Elasticsearch links and commands

* ```http://localhost:9200/_cat/indices?v``` - see status, size doc-count of all indexes.
* ```curl -X DELETE http://localhost:9200/browser-cpu``` - remove cpu index
