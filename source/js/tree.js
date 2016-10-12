import React from 'react'
import { component } from './reflex'
import { Store } from './reflex/Store'
import { actions } from './actions'

// const myWorker = require('worker?inline!./worker.js')

import {
  isArray,
  isObject
} from './utils'

const trampoline = (fn) => {
  let result = fn()
  while (result instanceof Function) {
    result = result()
  }
  return result
}

const type = (thing) => {
  if (thing === null) {
    return 'null'
  }
  else if (thing === undefined) {
    return 'undefined'
  }
  else if (Array.isArray(thing)) {
    return 'array'
  }
  else {
    return typeof(thing)
  }
}

const Collapsible = (fn) => {
  return React.createClass({
    displayName: fn.name,
    getInitialState() {
      return {
        collapsed: false
      }
    },
    componentDidMount(props) {
      this.props = props
    },
    collapse() {
      this.setState({
        collapsed: !this.state.collapsed
      })
      console.log('collapse')
    },
    mouseOver(e) {
      this.setState({
        ...this.state,
        over: true
      })
      e.stopPropagation()
    },
    mouseOut(e) {
      this.setState({
        ...this.state,
        over: false
      })
      e.stopPropagation()
    },
    render() {
      const classes = (
        'json-item'
        + (this.state.collapsed ? ' collapsed' : ' open')
        + (this.state.over ? ' over' : '')
      )
      return (
        <li className={classes}
          onMouseOver={this.mouseOver}
          onMouseOut={this.mouseOut}>
          {fn({
            ...this.props,
            collapse: this.collapse,
            collapsed: this.state.collapsed
          })}
        </li>
      )
    }
  })
}

const JsonName = function({ name, keepName }) {
  return !keepName
    ? null
    : (
        <span className="key">
          <span className="property">{name}</span>
          <span className="colon">:</span>
        </span>
      )
}

const jsonObject = function jsonObject(props) {
  const { name, value, keepName, collapse } = props
  return (
    <div className="hoverable">
      <JsonName {...props} />
      <div className="collapser" onClick={collapse}></div>
      <span className="bracket" onClick={collapse}>&#123;</span><span className="ellipsis" onClick={collapse}></span>
      <ul className="obj collapsible">
        {createPathHTML(value, true)}
      </ul>
      <span className="bracket" onClick={collapse}>&#125;</span>,
    </div>
  )
}
const nully = null
const JsonObject = Collapsible(jsonObject)

const jsonArray = function jsonArray(props) {
  const { name, value, keepName, collapse } = props
  return (
    <div className="hoverable">
      <JsonName {...props} />
      <div className="collapser" onClick={collapse}></div>
      <span className="bracket" onClick={collapse}>[</span>
      <span className="ellipsis ellipsis-array" onClick={collapse} data-length={value.length}></span>
      <ul className="array collapsible">
        {createPathHTML(value, true)}
      </ul>
      <span className="bracket" onClick={collapse}>]</span>,
    </div>
  )
}

const JsonArray = Collapsible(jsonArray)

const JsonString = function(props) {
  const { name, value, keepName } = props
  return (
    <li>
      <div className="hoverable">
        <JsonName {...props} />
        <span className={'type-' + type(value)}>"{value}"</span>
      </div>,
    </li>
  )
}

const JsonNull = function(props) {
  const { name, value, keepName } = props
  return (
    <li>
      <div className="hoverable">
        <JsonName {...props} />
        <span className={'type-' + type(value)}>null</span>
      </div>,
    </li>
  )
}

const JsonBoolean = function({ name, value }) {
  return (
    <li>
      <div className="hoverable">
        <span className="property">{name}</span>
        <span className="colon">:</span>
        <span className={'type-boolean'}>{value.toString()}</span>
      </div>,
    </li>
  )
}

const JsonDefault = function({ name, value }) {
  return (
    <li>
      <div className="hoverable">
        <span className="property">{name}</span>
        <span className="colon">:</span>
        <span className={'type-' + type(value)}>{value}</span>
      </div>,
    </li>
  )
}

export const createPathHTML = (tree, keepName = true) => {
  let ii = 0
  const go = (name, value) => {
    switch (type(value)) {
      case 'object':
        return (
          <JsonObject
            name={name}
            value={value}
            keepName={keepName}
            key={ii++} />
        )
      case 'array':
        return (
          <JsonArray
            name={name}
            value={value}
            keepName={keepName}
            key={ii++} />
        )
      case 'string':
        return (
          <JsonString
            name={name}
            value={value}
            keepName={keepName}
            key={ii++} />
        )
      case 'null':
        return (
          <JsonNull
            name={name}
            value={value}
            keepName={keepName}
            key={ii++} />
        )
      case 'boolean':
        return (
          <JsonBoolean
            name={name}
            value={value}
            keepName={keepName}
            key={ii++} />
        )
      default:
        return (
          <JsonDefault
            name={name}
            value={value}
            key={ii++} />
        )
    }
  }

  const keys = Object.keys(tree)

  return (
    keys.map(name => go(name, tree[name]))
  )
}

export const JsonFilter = ({ tree, filter }) => (
  <div className="filter">
    <div className="filter__header">
      <div className="form__field">
        <label className="form__label" htmlFor="filter">Filter</label>
        <input className="form__input"
          id="filter"
          type="text"
          onKeyUp={filter}/>
      </div>
    </div>
    <ul className="json">
      {createPathHTML(tree)}
    </ul>
  </div>
)

const defineEvents = ({ dispatch, props }) => ({
  filter: event => {
    dispatch(FILTER_LIST, {
      search: event.target.value
    })
  }
})

function viewObj(obj, path) {
  return path.length < 2
    ? obj
    : path
      .slice(0, path.length - 1)
      .reduce((acc, key) => {
        return (acc[key])
          ? acc[key]
          : acc
      }, obj)
  }

  function filterBy(obj, val) {

   	val = val.split(/(\.|\[|\])/)
    val.unshift('data')

    function iter(o, r) {
      return Object.keys(o).reduce(function (b, k) {
        var temp = Array.isArray(b) ? [] : {}
        if (k.toLowerCase().indexOf(val[val.length -1].toLowerCase()) !== -1) {
          r[k] = o[k]
          return true
        }
        if (o[k] !== null && typeof o[k] === 'object' && iter(o[k], temp)) {
          r[k] = temp
          return true
        }
        return b
      }, false)
    }

    var result = {}
    iter(viewObj(obj, val), result)
    return result
  }

  function view(obj, path) {
    path = path.split(/[\.|\[|\]]/)
    console.log('path', path)
    let level = 0
    function iter(o, r){
      if (o[path[level]]) {
        r = Object.assign(r, o[path[level]])
      }
      else if (path[level].length < 2) {
        return o
      }
      else {
        Object.keys(o)
          .filter(key => key.match(new RegExp(path[level])))
          .forEach(key => {
            r = Object.assign(r, o[key])
          })
      }
      if (++level < path.length) {
        return iter(r, {})
      }
      return r
    }
    const result = {}
    return iter(obj, result)
  }

const defineProps = ({ state, props }) => {

  console.log('defineProps', { state })

  let tree = {}
  if (state.filter && state.filter.length > 2) {
    // tree = filterBy(state.data, state.filter)
    tree = view(state.data, state.filter)
  } else {
    tree = state.data
  }

  return {
    tree,
    type: props.type
  }
}

export const Filter = component(
  defineEvents,
  defineProps
)(JsonFilter)

console.log({ Filter })

export default Filter

// const work = (data) => {
//   const worker = new myWorker()
//
//   console.dir({ worker })
//
//   worker.postMessage({
//     data
//   })
//
//   worker.onmessage = (e) => {
//     console.log('onmessage:tree.js', e)
//   }
//
//   worker.addEventListener('message', (e) => {
//     console.log(e)
//   })
// }

// work(1)
