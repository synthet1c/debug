import { fluent } from '../utils'
const actionWorker = require('worker?inline!../worker.js')
class State {
  constructor(value) {
    this.__value = Object.freeze(value)
  }
  map(fn) {
    return State.of(fn(this.__value))
  }
  static of(value) {
    return new State(value)
  }
}

let uid = 0
const threads = []

export const Store = (initialValue = {}, actions = {}) => {

  let state = new State(initialValue)
  let listeners = []

  return {
    subscribe: fluent(fn => {
      listeners.push(fn)
    }),
    register: fluent(reducers => {
      actions = { ...reducers }
    }),
    dispatch: fluent((action, ...rest ) => {

      // const worker = new actionWorker()
      // threads[uid] = worker
      //
      // threads[uid].onmessage = ({ data }) => {
      //   const newState = new State(data.state[0])
      //   listeners.forEach(fn => fn(newState.__value, action))
      //   state = newState
      //   threads[data.uid].terminate()
      //   delete threads[data.uid]
      // }
      //
      // threads[uid].postMessage({
      //   action,
      //   rest,
      //   state: state.__value,
      //   uid: uid++
      // })

      const newState = (rest.length)
        ? actions[action](...rest)(state)
        : actions[action](state)
      
      listeners.forEach(fn => fn(newState.__value, action))
      state = newState
    }),
    getState: () => Object.freeze(state.__value)
  }
}

export default Store
