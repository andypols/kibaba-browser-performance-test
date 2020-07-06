import {keys} from 'lodash';
import HeapStats from './stats/heap-stats';
import SystemCpuStats from './stats/system-cpu-stats';
import PerformanceStats from './stats/performance-stats';
import {getBrowserName} from './get-settings';

export class TimedDataCollector {
  chromeTabWeAreMonitoring;
  constructor(messageSender, chromeTabWeAreMonitoring) {
    this.messageSender = messageSender;
    this.chromeTabWeAreMonitoring = chromeTabWeAreMonitoring;
    this.performanceStats = new PerformanceStats(chromeTabWeAreMonitoring);

    this.timerHandlers = {
      heap: new HeapStats(),
      cpu: new SystemCpuStats()
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

      let performance = await this.performanceStats.collect();
      console.log({performance})

      this.messageSender.postMessage('browser-cpu', timerData);
    }, 1000);
  }
}