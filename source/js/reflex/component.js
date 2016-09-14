import React from 'react'
import { pinkLog, diff, blueLog } from '../utils'
import storeShape from './storeShape'

export const component = (...internals) => fn => {

  return React.createClass({
    displayName: fn.name,

    contextTypes: {
      store: storeShape.isRequired
    },

    getInitialState() {
      return {}
    },
    componentDidMount() {
      this.setState(this.context.store.getState())
      this.context.store.subscribe((state, action) => {
        this.setState(state)
        blueLog('component:subscribe', { action, state })
      })
      pinkLog('componentDidMount', this)
    },
    componentWillReceiveProps(nextProps) {
      pinkLog('componentWillReceiveProps', this, nextProps)
    },
    shouldComponentUpdate() {
      const shouldUpdate = diff(this.state, this.context.store.getState())
      pinkLog('shouldComponentUpdate', shouldUpdate)
      return shouldUpdate
    },
    render() {
      return fn.call(
        this,
        reduceInternals(
          internals,
          this.context.store.getState(),
          this.props,
          this.context.store.dispatch
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
