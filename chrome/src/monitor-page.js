import React from 'react';
import config from './config';

export default () => {
  return (
    <React.Fragment>
      <h1>Browser Performance Monitor</h1>

      <p>Sending the following stats to <code>{config.elasticIndexUrl}</code> you can see the data in the Kabana Dashboard with the browser name of <code>{config.browserName}</code></p>

      <ul>
        <li>System CPU</li>
        <li>Websocket message frequency</li>
        <li>...</li>
      </ul>
    </React.Fragment>
  );
}