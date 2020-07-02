import React from "react";
import {render} from 'react-dom';

import {getSystemInfo} from './utils';
import MessageSender from './message_sender';
import MonitorPage from './monitor-page.js'
import {getBrowserName} from './get-settings';

const messageSender = new MessageSender();

getSystemInfo(({cpu: {usage}, browser}) => {
  const totals = usage.reduce((acc, core) => {
    return {
      total: acc.total + core.total,
      idle: acc.idle + core.idle / core.total,
      user: acc.user + core.user / core.total,
      kernel: acc.kernel + core.kernel / core.total,
    }
  }, {idle: 0, user: 0, total: 0, kernel: 0})

  const {totalJSHeapSize, usedJSHeapSize, jsHeapSizeLimit} = window.performance.memory;

  const browserData = {
    '@timestamp': new Date().toISOString(),
    browser: browser,
    cpu: {
      idlePct: (totals.idle / usage.length) * 100,
      kernelPct: (totals.kernel / usage.length) * 100,
      userPct: (totals.user / usage.length) * 100
    },
    heap: {
      totalJSHeapSize,
      totalJSHeapSizePct: (totalJSHeapSize / jsHeapSizeLimit) * 100,
      usedJSHeapSize,
      usedJSHeapSizePct: (usedJSHeapSize / jsHeapSizeLimit) * 100,
      jsHeapSizeLimit,
    }
  };

  messageSender.postMessage('browser-cpu', browserData);
});

const tabId = parseInt(window.location.search.substring(1));

window.addEventListener("load", function() {
  chrome.debugger.sendCommand({tabId: tabId}, "Network.enable");
  chrome.debugger.onEvent.addListener(onEvent);
});

async function onEvent(debuggeeId, message, params) {
  if(tabId != debuggeeId.tabId) {
    return;
  }

  if(message === 'Network.webSocketFrameReceived') {
    messageSender.postMessage('browser-ws', {
      '@timestamp': new Date().toISOString(),
      browser: await getBrowserName(),
      payload: params.response.payloadData.length
    });
  } else {
    console.log({debuggeeId, message});
  }
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<MonitorPage />, root)