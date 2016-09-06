import {
  curry,
  map,
  over,
  lensProp,
  lensPath
} from 'ramda'

export const fuzzyReg = str => new RegExp('.*' + str.split('').join('.*') + '.*')

export const fuzzySearch = curry((search, str) => str.test(fuzzyReg(search)))

export const fluent = fn => function(...args) {
  const ret = fn.apply(this, args)
  return ret
    ? ret
    : this
}

export const log = curry((color, name, ...args) => {
  console.log(`%c${name}`, `color:${color};font-weight:bold`, ...args)
})

export const blueLog = log('#3cf')

export const pinkLog = log('#f3c')

export const define = (name, value) => window[name] = value || name

export const set = curry((val, __) => val)

export const isType = type => thing => typeof(thing) !== 'undefined' && typeof(thing) === type
export const isObject = isType('object')
export const isArray = Array.isArray

export const lens = curry((props, fn) => {
  if (typeof props === 'string') {
    props = props.split('.')
  }
  const _lens = (props.length > 1)
    ? lensPath(props)
    : lensProp(props[0])

  return map(over(_lens, fn))
})

export const reduceData = data => {
  const go = (obj) => {
    for (let key in obj) {
      const prop = obj[key] && (typeof obj[key].value !== 'undefined')
        ? obj[key].value
        : obj[key]
      if (typeof prop !== 'undefined') {
        obj[key] = prop
      }
      else if (Array.isArray(prop)) {
        obj[key] = reduceData(prop.slice())
      }
      else if (typeof prop === 'object') {
        obj[key] = reduceData({ ...prop })
      }
    }
    return obj
  }
  return go(data)
}

export const diff = (left = {}, right = {}) => {
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  if (rightKeys.length !== rightKeys.length) {
    return true
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    return leftKeys.some((key) => {
      return diff(left[key], right[key])
    })
  }
  for (let ii = 0, ll = leftKeys.length; ii < ll; ii++) {
    const leftKey = leftKeys[ii]
    const rightKey = rightKeys[ii]
    if (leftKey !== rightKey) {
      return true
    }
    if (Array.isArray(left[leftKey])) {
      return diff(left[leftKey], right[rightKey])
    }
    if (left[leftKey] !== right[rightKey]) {
      return true
    }
  }
  return false
}
