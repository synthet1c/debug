import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { data, store } from './data'
import { Container } from './reflex'
import { reduceData } from './utils'
import { actions } from './actions'
import './tree'

console.log('here', { data })

ReactDOM.render(
  <Container store={store} />,
  document.getElementById('app')
)
