import React from 'react'
import { blueLog } from '../utils'
import { App } from '../app'

class Container extends React.Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.state = this.store.getState()
  }
  componentDidMount() {
    this.store.subscribe((state, action) => {
      this.setState(state)
      blueLog('didMount', { action, state })
    })
  }
  componentWillReceiveProps(nextProps) {
    blueLog('componentWillReceiveProps', this, nextProps)
  }
  render() {
    return (
      <div className='Container'>
        <App />
      </div>
    )
  }
}
