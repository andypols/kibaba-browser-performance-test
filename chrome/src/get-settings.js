import config from './config';
import {isEmpty} from 'lodash';

export function getBrowserName() {
  return new Promise((resolve, reject) =>
    chrome.storage.sync.get('browserName', result => chrome.runtime.lastError
      ? reject(Error(chrome.runtime.lastError.message))
      : resolve(result ? result.browserName : config.browserName)
    )
  )
}

export function getElasticIndexUrl() {
  return new Promise((resolve, reject) =>
    chrome.storage.sync.get('elasticIndexUrl', (result) => {
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(isEmpty(result) ? config.elasticIndexUrl : result.elasticIndexUrl)
    })
  )
}