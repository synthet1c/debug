import React, { Component, PropTypes } from 'react'

export class Child extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="child">
        <h3>{this.props.title}</h3>
        <h4>{this.props.name}</h4>
      </div>
    )
  }
}

export class Parent extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  getChildContext() {
    return { title: 'from the parent' }
  }

  render() {
    console.log(this)
    return (
      <div className="test">
        <h1>Parent</h1>
        {this.props.children}
      </div>
    )
  }
}

const storeShape = PropTypes.shape({
  store: PropTypes.func.isRequired
})

Parent.propTypes = {
  store: storeShape.isRequired,
  children: PropTypes.element.isRequired
}
Parent.childContextTypes = {
  store: storeShape.isRequired
}

export default Parent
