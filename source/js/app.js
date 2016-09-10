import '../css/app.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { data } from './data'
import { Container } from './reflex'
import { reduceData } from './utils'
import { Filter } from './tree'
import { Store } from './reflex/Store'
import { actions } from './actions'

// ReactDOM.render(
//   <Container store={store} />,
//   document.getElementById('app')
// )

ReactDOM.render(
  <Filter store={data} type='user' />,
  document.getElementById('app')
)
