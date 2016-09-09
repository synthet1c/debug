import '../css/app.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { data, store } from './data'
import { Container } from './reflex'
import { reduceData } from './utils'
import { actions } from './actions'
import { createPathHTML } from './tree'


// ReactDOM.render(
//   <Container store={store} />,
//   document.getElementById('app')
// )

ReactDOM.render(
  <ul className="json">
    {createPathHTML(data)}
  </ul>,
  document.getElementById('app')
)
