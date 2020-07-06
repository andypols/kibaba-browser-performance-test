import WebSocketStats from './stats/web-socket-stats';
import {values, uniq} from 'lodash';

const chromeTabWeAreMonitoring = parseInt(window.location.search.substring(1));

export class EventDataCollector {
  constructor(messageSender) {
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
      chrome.debugger.sendCommand({tabId: chromeTabWeAreMonitoring}, eventType);
    }));
  }

  listenToRegisteredEvents() {
    chrome.debugger.onEvent.addListener(async(debuggeeId, message, params) => {
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
