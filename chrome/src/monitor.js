import React from "react";
import {render} from 'react-dom';

import MessageSender from './message_sender';
import MonitorPage from './monitor-page.js'
import {EventDataCollector} from './event-data-collector';
import {TimedDataCollector} from './timed-data-collector';

const messageSender = new MessageSender();
const eventDataCollector = new EventDataCollector(messageSender);
const timedDataCollector = new TimedDataCollector(messageSender);

window.addEventListener("load", function() {
  eventDataCollector.monitor();
  timedDataCollector.monitor();
});


const root = document.createElement('div');
document.body.appendChild(root);
render(<MonitorPage/>, root);