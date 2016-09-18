self.window = self
const _ = require('ramda')
const actions = require('./actions')
const FILTER_LIST = 'FILTER_LIST'

// const actions = {
//   [FILTER_LIST]: ({ search }) => {}
// }
//
console.log(actions)


onmessage = (e) => {
  console.log('onmessage:worker.js', e)
  const { type, data } = e.data
  postMessage({
    result: data * 2
  })
}
