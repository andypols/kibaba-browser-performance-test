import {getBrowserName} from '../get-settings';

export default class WebSocketStats {
   constructor(messageSender) {
     this.messageSender = messageSender;
   }

   async send(wsData) {
     this.messageSender.postMessage('browser-ws', {
       '@timestamp': new Date().toISOString(),
       browser: await getBrowserName(),
       payload: wsData.response.payloadData.length
     });
   }
}
