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

export const createPathHTML = (tree) => {
  const go = (key, value) => {
    switch (type(value)) {
      case 'object':
        return (
          <span className="json-item">
            <span className="json-key">{key}</span>
            <span className="json-object">
              {createPathHTML(value)}
            </span>
          </span>
        )
      case 'array':
        return (
          <span className="json-item">
            <span className="json-key">{key}</span>
            <span className="json-array">
              {createPathHTML(value)}
            </span>
          </span>
        )
      default:
        return (
          <span className="json-value">
            <span className="json-key">{key}</span>
            <span className="json-value">{value}</span>
          </span>
        )
    }
  }

  const keys = Object.keys(tree)

  return (
    keys.map(key => go(key, tree[key]))
  )
}

// const path = searchTree('php', flatTree)
// console.log({
//   flatTree,
//   searchTree: searchTree('javascript', flatTree),
//   createPath: path.map(createPath)
// })
