import {keys} from 'lodash';
import HeapStats from './stats/heap-stats';
import SystemCpuStats from './stats/system-cpu-stats';
import {getBrowserName} from './get-settings';

export class TimedDataCollector {
  constructor(messageSender) {
    this.messageSender = messageSender;
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

      this.messageSender.postMessage('browser-cpu', timerData);
    }, 1000);
  }
}