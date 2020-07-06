import WebSocketStats from './stats/web-socket-stats';

const chromeTabWeAreMonitoring = parseInt(window.location.search.substring(1));

export class EventDataMonitor {
  constructor(messageSender) {
    this.eventHandlers = {
      // Network.enable events
      'Network.webSocketFrameReceived': new WebSocketStats(messageSender)
    }
  }

  monitor() {
    this.registerEventListeners();
    this.listenToEvents();
  }

  registerEventListeners() {
    chrome.debugger.sendCommand({tabId: chromeTabWeAreMonitoring}, "Network.enable");
  }

  listenToEvents() {
    chrome.debugger.onEvent.addListener(async (debuggeeId, message, params) => {
      if(chromeTabWeAreMonitoring === debuggeeId.tabId) {
        if(this.eventHandlers[message]) {
          this.eventHandlers[message].send(params)
        } else {
          console.log('Ignoring: ', {debuggeeId, message});
        }
      }
    });
  }
}
