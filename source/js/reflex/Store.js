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
