import React from 'react'
import { component } from './reflex'
import { Store } from './reflex/Store'
import { actions } from './actions'

const myWorker = require('worker?inline!./worker.js')

import {
  isArray,
  isObject
} from './utils'

export const flattenTree = (tree) => {
  const ret = []
  let id = -1
  const go = (node, parent) => {
    for (let key in node) {
      id = id + 1
      const leaf = node[key]
      if (isArray(leaf)) {
        ret.push({
          type: 'array',
          id,
          value: 'array',
          children: leaf,
          key,
          tail: false,
          parent
        })
        go(leaf, id)
      }
      else if (isObject(leaf)) {
        ret.push({
          type: 'object',
          id: id,
          value: 'object',
          children: leaf,
          key,
          tail: false,
          parent
        })
        go(leaf, id)
      } else {
        ret.push({
          type: typeof(leaf),
          id: id,
          value: leaf,
          key,
          tail: true,
          parent
        })
      }
    }
  }
  go(tree, id)
  return ret
}

const trampoline = (fn) => {
  let result = fn()
  while (result instanceof Function) {
    result = result()
  }
  return result
}

const recursiveData = [0, 1, 2, Math.PI]

const sum = (total, first, ...rest) => {
  const go = () => {
    total += first
    console.log(total)
    if (rest.length) {
      return sum(total, ...rest)
    }
    return total
  }
  return go
}

trampoline(sum(0, ...recursiveData))

// console.log({
//   flattenTree: flattenTree(data)
// })

export const searchTree = (search, flatTree) => {

  const match = search.match(/([^:=]+)(?:[:=])*(.*)/)
  const searchKey = match ? match[1].trim() : ''
  const searchValue = match ? match[2].trim() : ''

  const matches = flatTree
    .reduce((acc, item) => {

      const key = item.key.toString()
      const value = item.value.toString()

      // does the current item key match the search param
      if (key.match(searchKey)) {
        //  does the search have a value
        if (searchValue !== '') {

          if (value === 'array') {
            console.log('isArray', findValueInChild(searchValue, item.children))
          }
          else if (value.match(searchValue)) {
            return acc.concat(item)
          }
        }
        else {
          return acc.concat(item)
        }
      }
      return acc
    }, [])

  const paths = matches.map(findPath(flatTree))

  console.log({ matches, paths })

  return paths
}

const TREE_DEPTH = 2

const findValueInChild = (value, tree) => {
  const go = (tree, level = 0) => {
    if (level++ > TREE_DEPTH) {
      return false
    }
    if (Array.isArray(tree)) {
      return tree.some(item => go(item, level))
    }
    else if (isObject(tree)) {
      return Object.getOwnPropertyNames(tree).some(key => go(tree[key], level))
    }
    return !!tree.toString().match(value)
  }
  return go(tree)
}

export const findPath = flatTree => item => {
  var ret = []
  while (item && item.id) {
    ret.push(item)
    item = flatTree[item.parent]
  }
  ret.push(flatTree[0])
  return ret.reverse()
}

export const createPath = (path) => {
  const ret = {}
  path.reduce((acc, item, ii, arr) => {
    const isLast = ii === arr.length - 1
    if (isLast) {
      return acc[item.key] = item.children || item.value
    }
    switch (item.type) {
      case 'object':
        acc[item.key] = {}
        break
      case 'array':
        acc[item.key] = []
        break
      default:
        acc[item.key] = item.value
    }
    return acc[item.key]
  }, ret)
  return ret
}

const hasOmnProperty = Object.hasOmnProperty


export const mergePaths = (paths) => {
  const ret = {}
  const go = (left, right) => {
    for (let key in right) {
      if (!hasOwnProperty.call(left, key)) {
        if (Array.isArray(left[key])) {
          left[key] = left[key].concat(right[key])
        } else{
          left[key] = right[key]
        }
      } else {
        return go(left[key], right[key])
      }
    }
  }
  paths.forEach(path => go(ret, path))
  return ret;
}

export const R_mergePaths = (pathArr) => {

  const ret = {}
  const go = (left, right) => {
    if (left == null || right == null || left === right) {
      return left
    }
    for (let key in right) {
      if (left[key] == null || !hasOwnProperty.call(left, key)) {
        if (Array.isArray(left[key])) {
          left[key] = left[key].concat(right[key])
        } else{
          left[key] = right[key]
        }
      } else {
        left[key] = go(left[key], right[key])
      }
    }
    return left
  }
  const result = pathArr.reduce(go, ret)

  console.log({ result, ret })

  return ret;
}

// export const mergePaths = (paths) => {
//   const ret = {}
//   paths.reduce(mergeObjects, ret)
//   return ret
// }

export const mergeObjects = (left, right) => {
  for (let key in right) {
    if (!hasOwnProperty.call(left, key)) {
      if (Array.isArray(left[key])) {
        left[key] = left[key].concat(right[key])
      } else{
        left[key] = right[key]
      }
    } else {
      return mergeObjects(left[key], right[key])
    }
  }
  return left
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
        {createPathHTML(value, false)}
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

const defineProps = ({ state, props }) => {

  console.log('defineProps', { state })

  let tree = {}

  if (state.filter && state.filter.length > 2) {
    const flatTree = flattenTree(state.data)
    console.log('filter', state.filter)
    const path = searchTree(state.filter, flatTree)
    // paths = mergePaths(path.map(createPath))
    tree = R_mergePaths(path.map(createPath))
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

// const flatTree = flattenTree(data)
// const path = searchTree('languages', flatTree)
//
// console.log({
//   flatTree,
//   path,
//   createPath: path.map(createPath)
// })


const work = (data) => {
  const worker = new myWorker()

  console.dir({ worker })

  worker.postMessage({
    data
  })

  worker.onmessage = (e) => {
    console.log('onmessage:tree.js', e)
  }

  worker.addEventListener('message', (e) => {
    console.log(e)
  })
}

work(1)
