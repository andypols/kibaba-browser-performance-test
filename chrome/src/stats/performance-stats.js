export default class PerformanceStats {
  constructor(chromeTabWeAreMonitoring) {
    this.chromeTabWeAreMonitoring = chromeTabWeAreMonitoring;
    chrome.debugger.sendCommand({tabId: chromeTabWeAreMonitoring}, 'Performance.enable');
  }

  async collect() {
    return new Promise((resolve, reject) => {
      const onGetMetric = ({metrics}) => resolve(metrics);
      chrome.debugger.sendCommand({tabId: this.chromeTabWeAreMonitoring}, 'Performance.getMetrics', {}, onGetMetric.bind(null));
    });
  }
}