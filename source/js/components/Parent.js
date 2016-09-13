import React, { Component, PropTypes } from 'react'

const storeShape = PropTypes.shape({
  dispatch: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
})

export class Child extends Component {
  render() {
    console.log(this)
    return (
      <div className='child'>
        <h3>Child</h3>
        <span>{this.context.color}</span>
      </div>
    )
  }
}

Child.contextTypes = {
  color: PropTypes.string,
  store: storeShape.isRequired
}

export class Parent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      color: props.color,
      store: props.store
    }
  }

  getChildContext() {
    return {
      color: this.state.color,
      store: this.state.store
    }
  }

  render() {
    console.log(this)
    return (
      <div className="Parent">
        <h1>Parent</h1>
        <p>{this.state.color}</p>
        {this.props.children}
      </div>
    )
  }
}

Parent.childContextTypes = {
  color: PropTypes.string,
  store: storeShape.isRequired
}

class Container {
  constructor(props) {
    this.Component = props
    console.log('Container construct', this)
  }
  render(jsx) {
    return this.Component.render(jsx)
  }
}

class Thing extends Container {
  constructor(props) {
    super(props)
    console.log('Thing construct', this)
  }
}

console.log(new Thing({one: 1}))
