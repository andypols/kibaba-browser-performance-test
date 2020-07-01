import React, {useEffect, useState} from 'react';
import EasyEdit, {Types} from 'react-easy-edit';
import {getBrowserName} from './get-settings';

export default ({config}) => {
  const [browserName, setBrowserName] = useState(config.browserName);

  const saveBrowserName = (value) => {
    chrome.storage.sync.set({browserName: value}, function() {
      console.log('Value is set to ' + value);
    });
  }

  useEffect(() => {
    getBrowserName()
      .then(value => {
        setBrowserName(value)
      })
  })

  return (
    <React.Fragment>
      <h1>Browser Performance Monitor</h1>

      <p>
        Sending the following stats to <strong>{config.elasticIndexUrl}</strong> with the browser identified as

        <EasyEdit
          type={Types.TEXT}
          value={browserName}
          onSave={saveBrowserName}
          onCancel={(cancel) => console.log({cancel})}
          saveButtonLabel="Save"
          cancelButtonLabel="Cancel"
          instructions="You can use this to filter the performance of this browser"
        /> (click to change)
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