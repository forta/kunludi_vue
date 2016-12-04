<template>
  <h2> {{kt("Together")}} |
  <a v-link="{ path: '/ludi' }"> {{kt("Play")}} | </a>
  <a v-link="{ path: '/lingvo' }"> {{kt("Language")}} </a></h2>

  <h3> {{kt("Under construction")}}</h2>

  <img src="./../../data/icons/social.jpg">

  <div class="kune">
	<div v-show="userId != ''">
        <h3>{{kt("Username")}}: {{ userId }}</h3>
        <button v-on:click="logout">Logout</button>
        <a v-show="userId != 'annonymous'"  v-link="{ path: '/kune/messages' }"> {{kt("Messages")}} | </a>
        <a v-show="userId != 'annonymous'"  v-link="{ path: '/kune/boards' }"> {{kt("Boards")}} | </a>
	</div>
    <router-view></router-view>
  </div>
</template>
<script>

import store from '../vuex/store'
import { getUserId, getKTranslator } from '../vuex/getters'
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
        kt: getKTranslator,
       userId: getUserId
    },
    actions: actions
  }
}
</script>


<style scoped>

</style>
