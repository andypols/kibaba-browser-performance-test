import React from 'react';

export default ({config}) => {

  console.log({config})
  return (
    <React.Fragment>
      <h1>Browser Performance Monitor</h1>

      <p>
        Sending the following stats to <code>{config.elasticIndexUrl}</code> with the browser identified as <strong>{config.browserName}</strong>.
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