import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activePoker: null
  },
  mutations: {
    setActivePoker (state, val) {
      state.activePoker = val
    }
  },
  actions: {

  }
})
