import HeapStats from './stats/heap-stats';
import SystemCpuStats from './stats/system-cpu-stats';
import {getBrowserName} from './get-settings';

export class TimedDataCollector {
  constructor(messageSender) {
    this.messageSender = messageSender;
    this.processors = [];
    this.timerHandlers = {
      heap: new HeapStats(),
      cpu: new SystemCpuStats()
    }
  }

  getCpuUsage(processors) {
    const usage = []
    for(let i = 0; i < processors.length; i++) {
      const processor = processors[i]

      if(processor.total === 0) continue

      const previousValue = this.processors[i];
      usage.push(
        previousValue
          ? {
            user: processor.user - previousValue.user,
            kernel: processor.kernel - previousValue.kernel,
            idle: processor.idle - previousValue.idle,
            total: processor.total - previousValue.total,
          }
          : processor,
      )
    }
    return usage
  }


  async sendTimerData(cb) {
    const cpu = await new Promise(resolve => {
      chrome.system['cpu'].getInfo(resolve)
    });

    const processors = cpu.processors.map(({usage}) => usage)

    const data = {
      browser: await getBrowserName(),
      cpu: this.getCpuUsage(processors)
    }

    cb(data);
    this.processors = processors;
    setTimeout(() => this.sendTimerData(cb), 1000);
  }

  monitor() {
    this.sendTimerData(({cpu, browser}) => {
      const browserData = {
        '@timestamp': new Date().toISOString(),
        browser: browser,
        cpu: this.timerHandlers['cpu'].collect(cpu),
        heap: this.timerHandlers['heap'].collect()
      };

      this.messageSender.postMessage('browser-cpu', browserData);
    });
  }
}