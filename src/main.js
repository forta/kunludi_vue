// see: https://auth0.com/blog/2015/11/13/build-an-app-with-vuejs/

var Vue = require('vue')
var VueRouter = require('vue-router')
var VueResource = require('vue-resource')

Vue.use(VueResource)
Vue.use(VueRouter)

var Kun  = require('./components/Kun.vue')
var Ludi = require('./components/Ludi.vue')

// create App instance
var App = Vue.extend({})

//create Router instance
var router = new VueRouter()

//add your routes and their components
router.map({
    '/kun': {
        component: Kun
    },
    '/ludi': {
        component: Ludi
    }
})

router.start(App, '#app')

