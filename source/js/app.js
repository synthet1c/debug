import '../css/app.scss'
import React from 'react'
import ReactDOM from 'react-dom'
// import App from './components/App'
import { data } from './data'
import { Container } from './reflex'
import { reduceData } from './utils'
import { Filter } from './tree'
import { Store } from './reflex/Store'
import { actions } from './actions'
// import { Parent, Child } from './components/Parent'

// ReactDOM.render(
//   <Container store={store} />,
//   document.getElementById('app')
// )

ReactDOM.render(
  <Container store={Store(data, actions)}>
    <Filter type='user' />
  </Container>,
  document.getElementById('app')
)

// class State {
//   constructor(value) {
//     this.__value = value
//   }
//   static of(val) {
//     return new State(val)
//   }
//   map(fn) {
//     return State.of(fn(this.__value))
//   }
// }
//
// const theStore = (data) => {
//
//   let state = new State(data)
//   const listeners = []
//
//   return {
//     dispatch: fn => {
//       const newState = state.map(fn)
//       listeners.forEach(listener => listener(newState))
//       return newState
//     },
//     subscribe: fn => listeners.push(fn),
//     getState: () => State.of(this.__value)
//   }
// }
//
// ReactDOM.render(
//   <Parent color='blue' store={theStore(data)}>
//     <div>
//       <Child />
//     </div>
//   </Parent>,
//   document.getElementById('app')
// )
