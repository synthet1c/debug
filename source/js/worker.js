self.window = self
const _ = require('ramda')
const actions = require('./actions').actions
const FILTER_LIST = 'FILTER_LIST'


// const actions = {
//   [FILTER_LIST]: ({ search }) => {}
// }
//
console.log(actions)


onmessage = ({ data }) => {
  const { action, state, rest, uid } = data

  console.log('onmessage:worker.js',{ action, state, rest })
  postMessage({
    action,
    uid,
    state: (rest.length)
      ? actions[action](...rest)([state])
      : actions[action]([state])
  })
}
