// see: https://auth0.com/blog/2015/11/13/build-an-app-with-vuejs/


/*
var express = require('express');
var app = express();
app.use('/ludi_data', express.static(__dirname + '/ludi_data'));
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
*/

var Vue = require('vue')
var VueRouter = require('vue-router')
var VueResource = require('vue-resource')

Vue.use(VueResource)
Vue.use(VueRouter)

//Vue.http.options.emulateJSON = true;
Vue.http.options.emulateHTTP = true;

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

