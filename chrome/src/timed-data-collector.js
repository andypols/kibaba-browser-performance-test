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

  getCpuUsage(processors, processorsOld) {
    const usage = []
    for(let i = 0; i < processors.length; i++) {
      const processor = processors[i]

      if(processor.total === 0) continue

      const processorOld = processorsOld[i]
      usage.push(
        processorOld
          ? {
            user: processor.user - processorOld.user,
            kernel: processor.kernel - processorOld.kernel,
            idle: processor.idle - processorOld.idle,
            total: processor.total - processorOld.total,
          }
          : processor,
      )
    }
    return usage
  }


  async sendTimerData(cb, processorsOld = []) {
    const cpu = await new Promise(resolve => {
      chrome.system['cpu'].getInfo(resolve)
    });

    const processors = cpu.processors.map(({usage}) => usage)

    const data = {
      browser: await getBrowserName(),
      cpu: this.getCpuUsage(processors, processorsOld)
    }

    cb(data)
    setTimeout(() => this.sendTimerData(cb, processors), 1000);
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