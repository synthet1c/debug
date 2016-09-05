import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { data, store } from './data'
import { Container } from './reflex'
import { reduceData } from './utils'
import { actions } from './actions'

console.log('here', { data })

ReactDOM.render(
  <div>
    <Container store={store} />
  </div>,
  document.getElementById('app')
)
