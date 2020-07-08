// Inspired by how the performance monitor code https://github.com/ChromeDevTools/devtools-frontend/blob/85535d62394d1324a662b776e5b3e4a2692627b8/front_end/timeline/PerformanceMonitor.js#L98-L139


const CUMULATIVE_TIME = 'CUMULATIVE_TIME';
const CUMULATIVE_COUNT = 'CUMULATIVE_COUNT';
const ACTUAL_COUNT = 'ACTUAL_COUNT';

Number.constrain = function(num, min, max) {
  if(num < min) {
    num = min;
  } else if(num > max) {
    num = max;
  }
  return num;
};


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

    const taskDuration = metrics.get('TaskDuration') * 100;
    const scriptDuration = metrics.get('ScriptDuration') * 100;
    const layoutDuration = metrics.get('LayoutDuration') * 100;
    const recalcStyleDuration = metrics.get('RecalcStyleDuration') * 100;
    return {
      domNodes: metrics.get('Nodes'),
      jSHeapUsedSize: metrics.get('JSHeapUsedSize'),
      jSHeapTotalSize: metrics.get('JSHeapTotalSize'),
      layouts: metrics.get('LayoutCount'),
      taskDuration,
      scriptDuration,
      layoutDuration,
      recalcStyleDuration,
      totalCpu: taskDuration + scriptDuration + layoutDuration + recalcStyleDuration
    };
  }


  async collect() {
    return new Promise((resolve, reject) => {
      const onGetMetric = ({metrics}) => resolve(this.processMetrics(metrics));
      chrome.debugger.sendCommand({tabId: this.chromeTabWeAreMonitoring}, 'Performance.getMetrics', {}, onGetMetric.bind(null));
    });
  }
}