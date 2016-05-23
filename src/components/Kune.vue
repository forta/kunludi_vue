<template>
  <div class="kune">
  	<h2>{{myi18n.Together.message}}</h2>
	<div v-show="userId != ''">
        <h3>{{myi18n.Username.message}}: {{ userId }}</h3>
        <button v-on:click="logout">Logout</button>
        <a v-show="userId != 'annonymous'"  v-link="{ path: '/kune/messages' }"> Messages | </a>
        <a v-show="userId != 'annonymous'"  v-link="{ path: '/kune/boards' }"> Boards | </a>
	</div>
    <router-view></router-view>
  </div>
</template>
<script>

import store from '../vuex/store'
import { geti18n,  getUserId } from '../vuex/getters'
import * as actions from '../vuex/actions'

export default {
  data () {
    return {
    }
  },
  methods: {
    logout: function () { 
        store.dispatch('RESETUSERID')
        this.$router.go('/ludi')
   	}
  },
  store: store,
  vuex: {
    getters: {
        myi18n: geti18n,
       userId: getUserId
    },
    actions: actions
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
</style>
