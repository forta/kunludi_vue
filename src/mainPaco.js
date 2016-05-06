// see: https://auth0.com/blog/2015/11/13/build-an-app-with-vuejs/

var Vue = require('vue')
var VueRouter = require('vue-router')
var VueResource = require('vue-resource')

Vue.use(VueResource)
Vue.use(VueRouter)

//Vue.http.options.emulateJSON = true;
Vue.http.options.emulateHTTP = true;

var Login  = require('./components/Login.vue')
var KunLudi = require('./components/KunLudi.vue')
var Games = require('./components/Games.vue')
//var LudiGameDetail = require('./components/LudiGameDetail.vue')

// create App instance
var App = Vue.extend({})

//create Router instance
var router = new VueRouter()

//add your routes and their components
router.map({
    '/login': {
        component: Login
    },
    '/kun-ludi': {
        component: KunLudi,
		subRoutes: {
			'/games': {
				component: Games 
			}
			/*,
			'/game/:gameId/': {
				name: 'gameDetail', 
				component: LudiGameDetail 
			},
					
			'/game/:gameId/load': {
				component: LudiGameDetail
			}
			*/
		}
	}
})

router.start(App, '#app')

