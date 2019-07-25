import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activePoke: null
  },
  mutations: {
    setActivePoke (state, val) {
      state.activePoke = val
      console.log(123)
    }
  },
  actions: {

  }
})
