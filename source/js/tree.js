import React from 'react'

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

// console.log({
//   flattenTree: flattenTree(data)
// })

export const searchTree = (search, flatTree) => {
  const matches = flatTree
    .filter(item => item.tail)
    .reduce((acc, item) => {
      return item.value.toString().match(search)
        ? acc.concat(item)
        : acc
    }, [])

  const paths = matches.map(findPath(flatTree))

  console.log({ matches, paths })

  return paths
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

// const flatTree = flattenTree(data)

export const createPath = (path) => {
  const ret = {}
  path.reduce((acc, item) => {
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

const type = (thing) => {
  if (thing === null) {
    return 'null'
  } else if (thing === undefined) {
    return 'undefined'
  } else if (Array.isArray(thing)) {
    return 'array'
  } else {
    return typeof(thing)
  }
}

const Name = ({ name, keepName }) => {
  return !keepName
    ? null
    : (
        <span className="key">
          <span className="property">{name}</span>
          <span className="colon">:</span>
        </span>
      )
}

const JsonObject = (props) => {
  const { name, value, keepName } = props
  return (
    <li>
      <div className="hoverable">
        <Name {...props} />
        <div className="collapser"></div>&#123;<span className="ellipsis"></span>
        <ul className="obj collapsible">
          {createPathHTML(value, true)}
        </ul>
        &#125;,
      </div>
    </li>
  )
}

const JsonArray = (props) => {
  const { name, value, keepName } = props
  return (
    <li>
      <div className="hoverable">
        <Name {...props} />
        <div className="collapser"></div>[<span className="ellipsis">Array[{value.length}]</span>
        <ul className="array collapsible">
          {createPathHTML(value, false)}
        </ul>
        ],
      </div>
    </li>
  )
}

const JsonString = (props) => {
  const { name, value, keepName } = props
  return (
    <li>
      <div className="hoverable">
        <Name {...props} />
        <span className={'type-' + type(value)}>"{value}"</span>
      </div>,
    </li>
  )
}

const JsonNull = (props) => {
  const { name, value, keepName } = props
  return (
    <li>
      <div className="hoverable">
        <Name {...props} />
        <span className={'type-' + type(value)}>null</span>
      </div>,
    </li>
  )
}

const JsonDefault = ({ name, value }) => {
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

// const path = searchTree('php', flatTree)
// console.log({
//   flatTree,
//   searchTree: searchTree('javascript', flatTree),
//   createPath: path.map(createPath)
// })
