<template>
  <div class="kune">
    <h1>Kune</h1>
    <h1>userId: {{ userId }}</h1>

	<div v-show="userId == 'annonymous'">
    	<!-- <a v-link="{ name: 'user',  params: { userId:userId } } " > Login | </a> --> 
	</div>
	<div v-else>
        <button v-on:click="logout">Logout</button>
        <a v-show="userId != 'annonymous'"  v-link="{ path: '/kune/messages' }"> Messages | </a>
        <a v-show="userId != 'annonymous'"  v-link="{ path: '/kune/boards' }"> Boards | </a>
	</div>
    <router-view></router-view>
  </div>
</template>

<script>

import store from '../vuex/store'
import { getUserId } from '../vuex/getters'
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
