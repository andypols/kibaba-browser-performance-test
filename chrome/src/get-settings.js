import config from './config';
import {isEmpty} from 'lodash';

function getSetting(setting) {
  return new Promise((resolve, reject) =>
    chrome.storage.sync.get(setting, (result) => {
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(isEmpty(result) ? config[setting] : result[setting])
    })
  )
}

export function getBrowserName() {
  return getSetting('browserName');
}

export function getElasticIndexUrl() {
  return getSetting('elasticIndexUrl');
}