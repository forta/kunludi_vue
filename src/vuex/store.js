var Vue = require('vue')
var Vuex = require('vuex')

Vue.use(Vuex)

const state = {
  count: 0,
  userId: 'forta'
}

const mutations = {
  INCREMENT (state) {
    state.count++
  },
  INCREMENTBY (state, par) {
    state.count+=par
  },
  DECREMENT (state) {
    state.count--
  },
  RESETUSERID (state) {
    state.userId= 'annonymous'
  },
  SETUSERID (state, par) {
    state.userId= par
  }
}

export default new Vuex.Store({
  state,
  mutations
})

