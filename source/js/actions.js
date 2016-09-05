import lenses from './lenses'
import { define, fuzzySearch } from './utils'
import { identity, curry, pipe, map, over, lensProp } from 'ramda'

define('FILTER_PRODUCT')
define('RESET_FILTER')
define('FILTER_BY_TYPE')

const trace = curry((name, value) => (console.log(name, value), value))

const recursiveFilter = curry((filterFn, obj) => {
  console.log('recursiveFilter', { filterFn, obj })
  return obj
})

const products = {
  [FILTER_PRODUCT]: ({ search }) => pipe(
    lenses.products(recursiveFilter(fuzzySearch(search))),
  ),
  [FILTER_BY_TYPE]: ({ search, type }) => pipe(
    map(over(lensProp(type), recursiveFilter(fuzzySearch(search))))
  ),
  [RESET_FILTER]: lenses.products(identity)
}


export const actions = {
  ...products
}

export default actions
