import lenses from './lenses'
import { define, fuzzySearch } from './utils'
import { identity, curry, pipe } from 'ramda'

define('FILTER_PRODUCT')
define('RESET_FILTER')

const recursiveFilter = curry((filterFn, obj) => {
  console.log({ filterFn, obj })
  return obj
})

const products = {
  [FILTER_PRODUCT]: ({ search }) => pipe(
    lenses.products(recursiveFilter(fuzzySearch(search))),
  ),
  [RESET_FILTER]: lenses.products(identity)
}


export const actions = {
  ...products
}

export default actions
