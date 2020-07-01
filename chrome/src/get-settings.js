import config from './config';

export function getBrowserName () {
  return new Promise((resolve, reject) =>
    chrome.storage.sync.get('browserName', result => chrome.runtime.lastError
      ? reject(Error(chrome.runtime.lastError.message))
      : resolve(result ? result.browserName : config.browserName)
    )
  )
}