'use strict';

// TODO
// * Mimic data already sent to kibana by beats plugins
// * console log cpu stats every 5 seconds
// * Send to kibana
// * Add settings to extension to specify browser name (default to machine?) - that appears in kibana - host/user/password/send frequency
// * assume store setting in storage
// * docs for adding extension

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });

  function postStats() {
    chrome.system.cpu.getInfo(function(cpuInfo) {
      let cpu = {}
      for(let i = 0; i < cpuInfo.numOfProcessors; i++) {
        cpu[i] = cpuInfo.processors[i].usage;
      }

      console.log('Sending data to kibana', {cpu})
    })
  }

  window.setInterval(postStats, 5000);

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
