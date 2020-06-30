import React from 'react';
import config from './config';

export default () => {
  return (
    <React.Fragment>
      <h1>Browser Performance Monitor</h1>

      <p>
        Sending the following stats to <code>{config.elasticIndexUrl}</code>
      </p>

      <ul>
        <li>System CPU</li>
        <li>Websocket message frequency</li>
        <li>Heap Usage (see <a href="https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory">Performance.memory</a>)</li>
        <li>...</li>
      </ul>
    </React.Fragment>
  );
}