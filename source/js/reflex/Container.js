import React from 'react'
import { blueLog } from '../utils'
import { App } from '../components/App'
import storeShape from './storeShape'

export default class Container extends React.Component {
  constructor(props = {}) {
    super(props)
    this.state = {
      store: this.props.store
    }
  }

  getChildContext() {
    return {
      store: this.state.store
    }
  }

  componentDidMount() {
    this.props.store.subscribe((state, action) => {
      this.setState(state)
      // blueLog('didMount', { action, state })
    })
  }
  componentWillReceiveProps(nextProps) {
    // blueLog('componentWillReceiveProps', this, nextProps)
  }
  render() {
    return <div>{this.props.children}</div>
  }
}

Container.childContextTypes = {
  store: storeShape.isRequired
}
