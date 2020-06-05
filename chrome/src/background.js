import {getSystemInfo} from './utils';
import ActivityIcon from './activity-icon';
import config from './config';

window.post = function(url, data) {
  return fetch(url, {
    method: 'POST',
    body: data,
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}

const colourConfig = {
  cpu: {
    border: '#1874cd',
    background: '#4876ff',
  }
}

const activityIcon = new ActivityIcon(colourConfig.cpu);

getSystemInfo(({cpu: {usage}}) => {
  const totals = usage.reduce((acc, core) => {
    return {
      idle: acc.idle + core.idle / core.total,
      user: acc.user + core.user / core.total,
      total: acc.total + core.total / core.total,
      kernel: acc.kernel + core.kernel / core.total,
    }
  }, {idle: 0, user: 0, total: 0, kernel: 0})

  const browserData = {
    '@timestamp': new Date().toISOString(),
    browser: config.browserName,
    cpu: {
      idlePct: (totals.idle / usage.length) * 100,
      kernelPct: (totals.kernel / usage.length) * 100,
      userPct: (totals.user / usage.length) * 100
    }
  };

  post(`${config.elasticIndexUrl}/_bulk`, `{"index":{"_index":"browser-data"}\n${JSON.stringify(browserData)}\n`)
    .catch((err => {
      console.log("Failed to send data:", err)
    }));

  const idle = browserData.cpu.idlePct / 100;

  chrome.browserAction.setTitle({
    title: `Usage: ${(100 * (1 - idle)).toFixed(0)}%`
  })
  activityIcon.update(idle);
  chrome.browserAction.setIcon({
    imageData: activityIcon.getImageData()
  })
})
