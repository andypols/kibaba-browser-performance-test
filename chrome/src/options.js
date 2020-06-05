import React, {useEffect, useState} from 'react'
import {render} from 'react-dom'
import {storage} from './utils'

const Options = () => {
  const [state, setState] = useState({
    ready: false,
    popup: {},
  });

  useEffect(() => {
    storage.getPopupStatus().then(popup => {
      setState({popup, ready: true})
    });
  });

  const setParams = params => {
    const result = {...state.popup, ...params}
    setState({popup: result}, () => {
      storage.setPopupStatus(result)
    })
  }

  const textMap = {
    cpu: 'CPU',
  }

  return (
    state.ready && (
      <div style={{lineHeight: 1.8}}>
        <h2>Popup settings</h2>
        <div style={{marginTop: 12, marginBottom: 12}}>
          {['cpu', 'memory'].map(item => (
            <div key={item}>
              <input
                id={item}
                type="checkbox"
                checked={state.popup[item]}
                onChange={e => setParams({[item]: e.target.checked})}
              />
              <label
                style={{
                  userSelect: 'none',
                  marginLeft: 2,
                }}
                htmlFor={item}
              >
                Show {textMap[item] || item}
              </label>
            </div>
          ))}
        </div>
      </div>
    )
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<Options/>, root)
