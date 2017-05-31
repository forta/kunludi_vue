	import Vue from 'vue'
import VueResource from 'vue-resource'
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.use(VueResource)

//game engine
const adminModule = require ('../../components/Admin.js');

// vue dependence (VueResource)
adminModule.initHttp (Vue.http)

function arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

const state = {
	connected: false,
	result: []
}

const mutations = {

  CONNECT (state, userId, password) {
		state.connected = adminModule.connect(userId, password)
  },

	QUERY_LOGS (state, logType) {
		state.result = []
		adminModule.queryLogs (logType)

		// get result after a period of time
		setTimeout (function(){
			state.result = adminModule.getResult();
			console.log ("Log result (" + logType + "): " + JSON.stringify (state.result))
		}, 1000)

  }

}

export default new Vuex.Store({
  state,
  mutations,
  modules: {
    // apps
  }
})
