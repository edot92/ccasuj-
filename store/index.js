import Vuex from 'vuex'
import state from './state'
const store = () => {
  return new Vuex.Store({
    state,
  })
}

export default store
