import WebSocketStats from './stats/web-socket-stats';
import {values, uniq} from 'lodash';

export class EventDataCollector {
  constructor(messageSender, chromeTabWeAreMonitoring) {
    this.chromeTabWeAreMonitoring = chromeTabWeAreMonitoring;
    this.eventHandlers = {
      'Network.webSocketFrameReceived': new WebSocketStats(messageSender)
    }
  }

  monitor() {
    this.registerEventListeners();
    this.listenToRegisteredEvents();
  }

  registerEventListeners() {
    let eventTypes = uniq(values(this.eventHandlers).map(handler => handler.typeOfEventsToListenFor()));

    eventTypes.forEach((eventType => {
      chrome.debugger.sendCommand({tabId: this.chromeTabWeAreMonitoring}, eventType);
    }));
  }

  listenToRegisteredEvents() {
    chrome.debugger.onEvent.addListener(async(debuggeeId, message, params) => {
      if(this.chromeTabWeAreMonitoring === debuggeeId.tabId) {
        if(this.eventHandlers[message]) {
          this.eventHandlers[message].send(params)
        } else {
          console.log('Ignoring: ', {debuggeeId, message});
        }
      }
    });
  }
}
