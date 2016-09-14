import lenses from './lenses'
import { define, fuzzySearch, lens, set } from './utils'
import { identity, curry, pipe, map, over, lensProp } from 'ramda'

define('FILTER_PRODUCTS')
define('RESET_FILTER')
define('FILTER_BY_TYPE')
define('FILTER_LIST')

const trace = curry((name, value) => (console.log(name, value), value))

const recursiveFilter = curry((filterFn, obj) => {
  console.log('recursiveFilter', { filterFn, obj })
  return obj
})

const products = {
  [FILTER_PRODUCTS]: ({ search }) => pipe(
    lens('products', recursiveFilter(fuzzySearch(search))),
  ),
  [FILTER_BY_TYPE]: ({ search, type }) => pipe(
    lens(type, recursiveFilter(fuzzySearch(search)))
  ),
  [RESET_FILTER]: lenses.products(identity),
  [FILTER_LIST]: ({ search }) => lens('filter', set(search)),
}


export const actions = {
  ...products
}

export default actions
