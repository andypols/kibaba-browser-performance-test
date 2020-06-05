import {getSystemInfo} from './utils';
import ActivityIcon from './activity-icon';
import config from './config';

const ICON_SIZE = 19;
const BORDER_WIDTH = 2;

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

// 3 => [1, 1, 1]
function fill(count) {
  const arr = []
  for(let i = 0; i < count; i += 1) {
    arr.push(1)
  }
  return arr
}

const cpuIdleArray = fill(ICON_SIZE);
const activityIcon = new ActivityIcon(colourConfig.cpu);

getSystemInfo(({cpu: {usage}}) => {
  const idle = usage.reduce((a, b) => a + b.idle / b.total, 0) / usage.length;

  const totals = usage.reduce((acc, core) => {
    return {
      idle: acc.idle + core.idle / core.total,
      user: acc.user + core.user / core.total,
      total: acc.total + core.total / core.total,
      kernel: acc.kernel + core.kernel / core.total,
    }
  }, {i: 0, idle: 0, total: 0, kernel: 0, user: 0})

  const browserData = {
    '@timestamp': new Date().toISOString(),
    browser: config.browserName,
    cpu: {
      idlePct: (totals.idle / usage.length) * 100,
      kernelPct:(totals.kernel / usage.length) * 100,
      userPct:(totals.user / usage.length) * 100
    }
  };

  // post('http://localhost:9200/_bulk', `{"index":{"_index":"browser-data"}\n${JSON.stringify(browserData)}\n`)
  //       .catch((err => {
  //         console.log("Failed to send data:", err)
  //       }));

  console.log(browserData)

  cpuIdleArray.push(idle)
  cpuIdleArray.shift();

  chrome.browserAction.setTitle({
    title: `Usage: ${(100 * (1 - browserData.cpu.idlePct)).toFixed(0)}%`
  })
  activityIcon.update(cpuIdleArray);
  chrome.browserAction.setIcon({
    imageData: activityIcon.getImageData()
  })
})
