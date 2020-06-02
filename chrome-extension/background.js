'use strict';

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

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('Started...');
  });

  function postStats() {
    chrome.system.cpu.getInfo(function(cpuInfo) {
      console.log(cpuInfo)

      const processors = cpuInfo.processors.reduce((accumulator, processor) => {
        return {
          total: accumulator.total + processor.usage.total,
          idle: accumulator.idle + processor.usage.idle,
          kernel: accumulator.kernel + processor.usage.kernel,
          user: accumulator.user + processor.usage.user
        }
      }, {total: 0, kernel: 0, idle: 0, user: 0});

      let cpuData = {
        '@timestamp': new Date().toISOString(),
        browser: "Andy's Chrome",
        cpu: {
          totalValue: processors.total,
          idleValue: processors.idle,
          idlePct: (processors.idle / processors.total) * 100,
          kernelValue: processors.kernel,
          kernelPct: (processors.kernel / processors.total) * 100,
          userValue: processors.user,
          userPct: (processors.user / processors.total) * 100
        }
      }

      post('http://localhost:9200/_bulk', `{"index":{"_index":"browser-cpu"}\n${JSON.stringify(cpuData)}\n`)
        .catch((err => {
          console.log("Failed to send data:", err)
        }));
    })
  }

  window.setInterval(postStats, 10000);

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
