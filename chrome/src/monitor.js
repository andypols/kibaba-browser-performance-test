import React from "react";
import {render} from 'react-dom';

import {getSystemInfo} from './utils';
import ActivityIcon from './activity-icon';
import config from './config';
import MessageSender from './message_sender';
import MonitorPage from './monitor-page.js'

const messageSender = new MessageSender();
const activityIcon = new ActivityIcon();

function updateIcon(browserData) {
  const idle = browserData.cpu.idlePct / 100;

  chrome.browserAction.setTitle({
    title: `Usage: ${(100 * (1 - idle)).toFixed(0)}%`
  });

  activityIcon.update(idle);
  chrome.browserAction.setIcon({
    imageData: activityIcon.getImageData()
  });
}

getSystemInfo (({cpu: {usage}, browser}) => {
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
  updateIcon(browserData);
});

const tabId = parseInt(window.location.search.substring(1));

window.addEventListener("load", function() {
  chrome.debugger.sendCommand({tabId: tabId}, "Network.enable");
  chrome.debugger.onEvent.addListener(onEvent);
});

function onEvent(debuggeeId, message, params) {
  if(tabId != debuggeeId.tabId) {
    return;
  }

  if(message === 'Network.webSocketFrameReceived') {
    messageSender.postMessage('browser-ws', {
      '@timestamp': new Date().toISOString(),
      browser: config.browserName,
      payload: params.response.payloadData.length
    });
  } else {
    console.log({debuggeeId, message, params});
  }
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<MonitorPage config={config}/>, root)