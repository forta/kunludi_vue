var Vue = require('vue')
var VueRouter = require('vue-router')
var VueResource = require('vue-resource')

var Vuex = require('vuex')

Vue.use(VueResource)
Vue.use(Vuex)
Vue.use(VueRouter)

//create Router instance
var router = new VueRouter()

// VueRouter.use(Vuex)

var store = require('./vuex/store.js')

//Vue.http.options.emulateJSON = true;
Vue.http.options.emulateHTTP = true;

var Ludi  = require('./components/Ludi.vue')
var Login  = require('./components/Login.vue')
var Kune  = require('./components/Kune.vue')
var About = require('./components/About.vue')
var More = require('./components/More.vue')
var Games = require('./components/Games.vue')
var Play = require('./components/Play.vue')
var Lingvo = require('./components/Lingvo.vue')

// create App instance
var App = Vue.extend({})


function storageON() {
    try {
        localStorage.setItem("__test", "data");
    } catch (e) {
        return false;
    } 
    return true;
}

// load data from localStorage
if (storageON()) {
	if (localStorage.ludi_userId  != undefined) store.default._mutations.SETUSERID (store.default.state, localStorage.ludi_userId)
	if (localStorage.ludi_locale  != undefined) store.default._mutations.SETLOCALE (store.default.state, localStorage.ludi_locale)
}
		
//add your routes and their components
router.map({
    '/': {
        component:  Ludi
	},
    '/ludi': {
        component:  Ludi,
		subRoutes: {
			'/': {
				component: Games
			},
			'/about': {
				component: About
			},
			'/more': {
				component: More
			},
			'/games': {
				component: Games 
			},
			'/play': {
				component: Play 
			}
		}
	},
	'/kune': {
        component:  Kune,
		subRoutes: {
			'/': {
				component: Login
			},
			'/login': {
				component: Login
			}, 
			'/login/:userId': {
				name: 'user', 
				component: Login
			}, 
			'/messages': {
				component: {
				  template: '<h2>Messages<h2><h3>messageList</h3><h4>chatInput</h4>'
				} 
			},
			 '/boards': {
				component:{
				  template: '<h2>Boards<h2><h3>boardList</h3><h4>chatInput</h4>'
				} 
			}
		}
	},
	'/lingvo': {
        component:  Lingvo
	}		
})

/*
router.beforeEach(function (transition) {
  
	// console.log('transition:' + JSON.stringify (transition))

	//if ((transition.to.path == '/kune' ) && !transition.to.auth) {
	//	transition.redirect('/kune/login/annonymous')
	//} else {
		transition.next()
	//}
})
*/

router.start(App, '#app')

