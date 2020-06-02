'use strict';

// TODO
// * Mimic data already sent to kibana by beats plugins
// * console log cpu stats every 5 seconds
// * Send to kibana
// * Add settings to extension to specify browser name (default to machine?) - that appears in kibana - host/user/password/send frequency
// * assume store setting in storage
// * docs for adding extension

/*
{"index":{"_index":"logstash-2015.05.18"}}
{
    "@timestamp": "2020-06-01T18:45:35.676Z",
    "browser": "Andy's Chrome",
    "cpu": {
      "core": {
        "0": {"idle": 66.28134316193288, "kernel": 19.63469771656071,  "user": 14.083959121506412}
        "1": {"idle": 96.40977226799265, "kernel": 2.0329333672027774, "user": 1.5572943648045807}
        "2": {"idle": 74.64440441155881, "kernel": 12.243995844995393, "user": 13.111599743445801}
        "3": {"idle": 96.8944422387058,  "kernel": 1.658337642024288,  "user": 1.4472201192698995}
        "4": {"idle": 79.07025740435469, "kernel": 9.127645424376324,  "user": 11.802097171268986}
        "5": {"idle": 97.08749159513573, "kernel": 1.4321188658658668, "user": 1.4803895389984036}
        "6": {"idle": 81.87481977694844, "kernel": 7.331498739063689,  "user": 10.793681483987859}
        "7": {"idle": 97.1659314389761,  "kernel": 1.2623714434964768, "user": 1.5716971175274215}
      }
    }
}
*/

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });

  function postStats() {
    chrome.system.cpu.getInfo(function(cpuInfo) {
      const timestamp = new Date().toISOString();
      const core = {}
      for(let i = 0; i < cpuInfo.numOfProcessors; i++) {
        const usage = cpuInfo.processors[i].usage;
        core[i] = {
          idle: (usage.idle / usage.total) * 100,
          kernel: (usage.kernel / usage.total) * 100,
          user: (usage.user / usage.total) * 100
        };
      }

      let cpuData = {
        '@timestamp': timestamp,
        browser: "Andy's Chrome",
        cpu: {core: core}
      }

      console.log(cpuData)
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
