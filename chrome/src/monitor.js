import React from "react";
import {render} from 'react-dom';

import MessageSender from './message_sender';
import MonitorPage from './monitor-page.js'
import {getBrowserName} from './get-settings';
import HeapStats from './stats/heap-stats';
import SystemCpuStats from './stats/system-cpu-stats';
import {EventDataCollector} from './event-data-collector';
import {TimedDataCollector} from './timed-data-collector';

const messageSender = new MessageSender();
const eventDataCollector = new EventDataCollector(messageSender);
const timedDataCollector = new TimedDataCollector(messageSender);

window.addEventListener("load", function() {
  eventDataCollector.monitor();
  timedDataCollector.monitor();
});

//
// Data handlers for timer based things we collect every second
//

const timerHandlers = {
  heap: new HeapStats(),
  cpu: new SystemCpuStats()
}

function getCpuUsage(processors, processorsOld) {
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

async function sendTimerData(cb, processorsOld = []) {
  const cpu = await new Promise(resolve => {
    chrome.system['cpu'].getInfo(resolve)
  });

  const processors = cpu.processors.map(({usage}) => usage)

  const data = {
    browser: await getBrowserName(),
    cpu: getCpuUsage(processors, processorsOld)
  }

  cb(data)
  setTimeout(() => sendTimerData(cb, processors), 1000);
}

sendTimerData(({cpu, browser}) => {
  const browserData = {
    '@timestamp': new Date().toISOString(),
    browser: browser,
    cpu: timerHandlers['cpu'].collect(cpu),
    heap: timerHandlers['heap'].collect()
  };

  messageSender.postMessage('browser-cpu', browserData);
});


const root = document.createElement('div')
document.body.appendChild(root)
render(<MonitorPage/>, root)