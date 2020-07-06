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
      this.messageSender.postMessage('browser-cpu', {
        '@timestamp': new Date().toISOString(),
        browser: await getBrowserName(),
        cpu: await this.timerHandlers['cpu'].collect(),
        heap: await this.timerHandlers['heap'].collect()
      });
    }, 1000);
  }
}