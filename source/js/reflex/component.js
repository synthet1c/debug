import React from 'react'
import { pinkLog, diff } from '../utils'

export const component = (...internals) => fn => store => {
  return React.createClass({
    displayName: fn.name,
    componentDidMount() {
      pinkLog('componentDidMount', this)
      this.__state = store.getState()
    },
    componentWillReceiveProps(nextProps) {
      pinkLog('componentWillReceiveProps', this, nextProps)
    },
    shouldComponentUpdate() {
      const shouldUpdate = diff(this.__state, store.getState())
      pinkLog('shouldComponentUpdate', shouldUpdate)
      return shouldUpdate
    },
    render() {
      return fn.call(
        this,
        reduceInternals(
          internals,
          store.getState(),
          this.props,
          store.dispatch
        )
      )
    }
  })
}


export const reduceInternals = (internals, state, props, dispatch) => {
  return internals.reduce((acc, x) => ({
    ...acc,
    ...x({ state, props, dispatch })
  }), {})
}

export default component
