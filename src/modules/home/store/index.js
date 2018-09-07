import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import * as getters from './getters'
import mutations from './mutations'
// import actions from './actions'
// import plugins from './plugins'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  // actions,
  mutations
})
