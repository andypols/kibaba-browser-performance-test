import React from "react";
import {render} from 'react-dom';

import MessageSender from './message_sender';
import MonitorPage from './monitor-page.js'
import {getBrowserName} from './get-settings';
import WebSocketStats from './stats/web-socket-stats';
import HeapStats from './stats/heap-stats';
import SystemCpuStats from './stats/system-cpu-stats';

const messageSender = new MessageSender();
const chromeTabWeAreMonitoring = parseInt(window.location.search.substring(1));

//
// Data handlers for event based things we are interested in.
//

const eventHandlers = {
  'Network.webSocketFrameReceived': new WebSocketStats(messageSender)
}

window.addEventListener("load", function() {
  // listen to things that interest us
  chrome.debugger.sendCommand({tabId: chromeTabWeAreMonitoring}, "Network.enable");

  // post event data we are interested in to Elastic
  chrome.debugger.onEvent.addListener(async function(debuggeeId, message, params) {
    if(chromeTabWeAreMonitoring === debuggeeId.tabId) {
      if(eventHandlers[message]) {
        eventHandlers[message].send(params)
      } else {
        console.log('Ignoring: ', {debuggeeId, message});
      }
    }
  });
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

export async function sendTimerData(cb, processorsOld = []) {
  const cpu = await new Promise(resolve => {
    chrome.system['cpu'].getInfo(resolve)
  });

  const data = {browser: await getBrowserName()}
  let processors
  if(cpu) {
    processors = cpu.processors.map(({usage}) => usage)
    data.cpu = {
      usage: getCpuUsage(processors, processorsOld)
    }
  }

  cb(data)
  setTimeout(() => sendTimerData(cb, processors), 1000);
}

sendTimerData(({cpu: {usage}, browser}) => {
  const browserData = {
    '@timestamp': new Date().toISOString(),
    browser: browser,
    cpu: timerHandlers['cpu'].collect(usage),
    heap: timerHandlers['heap'].collect()
  };

  messageSender.postMessage('browser-cpu', browserData);
});


const root = document.createElement('div')
document.body.appendChild(root)
render(<MonitorPage/>, root)