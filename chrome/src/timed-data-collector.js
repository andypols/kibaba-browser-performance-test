import {keys} from 'lodash';
import SystemCpuStats from './stats/system-cpu-stats';
import PerformanceStats from './stats/performance-stats';
import {getBrowserName} from './get-settings';

export class TimedDataCollector {
  constructor(messageSender, chromeTabWeAreMonitoring) {
    this.messageSender = messageSender;
    this.chromeTabWeAreMonitoring = chromeTabWeAreMonitoring;
    this.oldScriptDuration = null

    this.timerHandlers = {
      cpu: new SystemCpuStats(),
      performance: new PerformanceStats(chromeTabWeAreMonitoring)
    }
  }

  monitor() {
    setInterval(async() => {
      let timerData = {
        '@timestamp': new Date().toISOString(),
        browser: await getBrowserName()
      };

      for(const handler of keys(this.timerHandlers)) {
        timerData[handler] = await this.timerHandlers[handler].collect();
      }

      this.messageSender.postMessage('browser-cpu', timerData);
    }, 1000);
  }
}