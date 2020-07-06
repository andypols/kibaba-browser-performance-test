// Inspired by how the performance monitor code https://github.com/ChromeDevTools/devtools-frontend/blob/85535d62394d1324a662b776e5b3e4a2692627b8/front_end/timeline/PerformanceMonitor.js#L98-L139

/**
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @return {number}
 */

Number.constrain = function(num, min, max) {
  if(num < min) {
    num = min;
  } else if(num > max) {
    num = max;
  }
  return num;
};

const CUMULATIVE_TIME = 'CUMULATIVE_TIME';
const CUMULATIVE_COUNT = 'CUMULATIVE_COUNT';
const ACTUAL_COUNT = 'ACTUAL_COUNT';

const metricTypes = {
  'ScriptDuration': CUMULATIVE_TIME
}


export default class PerformanceStats {
  constructor(chromeTabWeAreMonitoring) {
    chrome.debugger.sendCommand({tabId: chromeTabWeAreMonitoring}, 'Performance.enable');

    this.chromeTabWeAreMonitoring = chromeTabWeAreMonitoring;
    this.metricData = new Map();
    this.metricModes = new Map([
      ['TaskDuration', CUMULATIVE_TIME],
      ['ScriptDuration', CUMULATIVE_TIME],
      ['LayoutDuration', CUMULATIVE_TIME],
      ['RecalcStyleDuration', CUMULATIVE_TIME],
      ['LayoutCount', CUMULATIVE_COUNT],
      ['RecalcStyleCount', CUMULATIVE_COUNT]
    ]);
  }

  processMetrics(rawMetrics) {
    let metrics = new Map();
    const timestamp = Date.now();

    for(let metric of rawMetrics) {
      let data = this.metricData.get(metric.name);
      if(!data) {
        data = {};
        this.metricData.set(metric.name, data);
      }

      let value;

      switch(this.metricModes.get(metric.name)) {
        case CUMULATIVE_TIME:
          value = data.lastTimestamp ?
            Number.constrain((metric.value - data.lastValue) * 1000 / (timestamp - data.lastTimestamp), 0, 1) :
            0;
          data.lastValue = metric.value;
          data.lastTimestamp = timestamp;
          break;

        case CUMULATIVE_COUNT:
          value = data.lastTimestamp ?
            Math.max(0, (metric.value - data.lastValue) * 1000 / (timestamp - data.lastTimestamp)) :
            0;
          data.lastValue = metric.value;
          data.lastTimestamp = timestamp;
          break;

        default:
          value = metric.value;
          break
      }

      metrics.set(metric.name, value);
    }

    // console.log({metrics})
    /*
    this._metricsBuffer.push({timestamp, metrics: metrics});
    var millisPerWidth = this._width / this._pixelsPerMs;
    // Multiply by 2 as the pollInterval has some jitter and to have some extra samples if window is resized.
    var maxCount = Math.ceil(millisPerWidth / this._pollIntervalMs * 2);
    if (this._metricsBuffer.length > maxCount * 2)  // Multiply by 2 to have a hysteresis.
      this._metricsBuffer.splice(0, this._metricsBuffer.length - maxCount);
    this._controlPane.updateMetrics(metrics);
     */

    return {
      domNodes: metrics.get('Nodes'),
      jSHeapUsedSize: metrics.get('JSHeapUsedSize'),
      jSHeapTotalSize: metrics.get('JSHeapTotalSize'),
      layouts: metrics.get('LayoutCount')
    };
  }


  async collect() {
    return new Promise((resolve, reject) => {
      const onGetMetric = ({metrics}) => resolve(this.processMetrics(metrics));
      chrome.debugger.sendCommand({tabId: this.chromeTabWeAreMonitoring}, 'Performance.getMetrics', {}, onGetMetric.bind(null));
    });
  }
}


/*

0: {name: "Timestamp", value: 49188.013079}
1: {name: "AudioHandlers", value: 0}
2: {name: "Documents", value: 1}
3: {name: "Frames", value: 1}
4: {name: "JSEventListeners", value: 139}
5: {name: "LayoutObjects", value: 1462}
6: {name: "MediaKeySessions", value: 0}
7: {name: "MediaKeys", value: 0}
8: {name: "Nodes", value: 14802}
9: {name: "Resources", value: 9}
10: {name: "ContextLifecycleStateObservers", value: 3}
11: {name: "V8PerContextDatas", value: 5}
12: {name: "WorkerGlobalScopes", value: 0}
13: {name: "UACSSResources", value: 0}
14: {name: "RTCPeerConnections", value: 0}
15: {name: "ResourceFetchers", value: 1}
16: {name: "AdSubframes", value: 0}
17: {name: "DetachedScriptStates", value: 0}
18: {name: "LayoutCount", value: 55193}
19: {name: "RecalcStyleCount", value: 89843}
20: {name: "LayoutDuration", value: 22.585727}
21: {name: "RecalcStyleDuration", value: 29.895745}
22: {name: "DevToolsCommandDuration", value: 0.325639}
23: {name: "ScriptDuration", value: 410.789067}
24: {name: "V8CompileDuration", value: 0.021211}
25: {name: "TaskDuration", value: 582.104594}
26: {name: "TaskOtherDuration", value: 118.487205}
27: {name: "ThreadTime", value: 204.026748}
28: {name: "JSHeapUsedSize", value: 4948064}
29: {name: "JSHeapTotalSize", value: 6639616}
30: {name: "FirstMeaningfulPaint", value: 0}
31: {name: "DomContentLoaded", value: 49106.075314}
32: {name: "NavigationStart", value: 49105.939922}
 */