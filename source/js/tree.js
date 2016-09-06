import {
  isArray,
  isObject
} from './utils'

const data = {
  user: {
    name: 'andrew',
    age: 32,
    languages: [
      { name: 'javascript' },
      { name: 'php' },
      { name: 'node' },
      { name: 'laravel' },
    ],
    hobbies: [
      { name: 'javascript' },
    ]
  }
}

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

console.log({
  flattenTree: flattenTree(data)
})

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

const flatTree = flattenTree(data)

export const creatObject = item => {
  switch (item.type) {
    case 'object':
      let obj = {}
      obj[item.key] = item.value
    case 'array':
      let arr = []
      arr[Number(item.key)] = item.value
    default:
      return item.value
  }
}

export const createStructure = (items) => {
  let ii = 0
  const go = (self) => {
    const item = path[ii]
    switch (item.type) {
      case 'object':
        self[item.key] = {}
      case 'array':
        self[item.key] = []
      default:
        self[item.key] = item.value
    }
    if (items[ii++]) {
      return go(self)
    }
  }
  return go({})
}

export const createPath = path => {
  let ret = {}
  let curr = {}
  for (let ii = 0, ll = path.length; ii < ll; ii+=1) {
    const item = path[ii]
    switch (item.type) {
      case 'object':
        ret[item.key] = {}
      case 'array':
        ret[item.key] = []
      default:
        ret[item.key] = item.value
    }
  }
  return ret
}

console.log({
  flatTree,
  searchTree: searchTree('javascript', flatTree),
  createPath: flatTree.map(createPath)
})
