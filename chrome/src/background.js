import {getSystemInfo} from './utils';
import ActivityIcon from './activity-icon';
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
      i: acc.i + core.idle / core.total,
      idle: acc.idle + core.idle,
      user: acc.user + core.user,
      total: acc.total + core.total,
      kernel: acc.kernel + core.kernel
    }
  }, {i: 0, idle: 0, total: 0, kernel: 0, user: 0})

  const browserData = {
    '@timestamp': new Date().toISOString(),
    browser: "Andy's Chrome",
    cpu: {
      totalValue: totals.total,
      idleValue: totals.idle,
      idlePct: (totals.idle / totals.total * 100).toFixed(0),
      kernelValue: totals.kernel,
      kernelPct:(totals.kernel / totals.total * 100).toFixed(0),
      userValue: totals.user,
      userPct: (totals.user / totals.total * 100).toFixed(0)
    }
  };

  // post('http://localhost:9200/_bulk', `{"index":{"_index":"browser-data"}\n${JSON.stringify(browserData)}\n`)
  //       .catch((err => {
  //         console.log("Failed to send data:", err)
  //       }));

  console.log({idle, cpu: ((browserData.cpu.idleValue / browserData.cpu.totalValue) * 100) / usage.length, i: totals.i/ usage.length})

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
