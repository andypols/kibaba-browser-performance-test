import {isEmpty} from 'lodash';

function getSetting(setting) {
  return new Promise((resolve, reject) =>
    chrome.storage.sync.get(setting, (result) => {
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(isEmpty(result) ? null : result[setting])
    })
  )
}

export function getBrowserName() {
  return getSetting('browserName');
}

export function getElasticIndexUrl() {
  return getSetting('elasticIndexUrl');
}