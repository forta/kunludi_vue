<template>
  <div class="ludi">
  	<h2>{{kt("Play")}}</h2>
	<h2 v-show="gameId"> gameId: {{ gameId}} </h2> 
	<a v-show="gameId==''" v-link="{ path: '/ludi/games' }"> Games | </a>
	<a v-show="gameId!=''" v-link="{ path: '/ludi/play' }"> Play | </a>
	<a v-show="gameId!=''" v-on:click="quit"> Quit | </a>
	<router-view></router-view>
  </div>
</template>

<script>

	import store from '../vuex/store'
	import { getKTranslator, getGameId } from '../vuex/getters'
	import * as actions from '../vuex/actions'

export default {
  data () {
    return {
    }
  },
  methods: {
    quit: function () { 
        store.dispatch('RESETGAMEID')
	}
  },
  store: store,
  vuex: {
    getters: {
       kt: getKTranslator,
       gameId: getGameId,
    },
    actions: actions
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

html {
  height: 100%;
}

body {
  display: flex;
  justify-content: center;
  height: 100%;
}

#app {
  color: #2c3e50;
  max-width: 600px;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: center;
}

#app a {
  color: #42b983;
  text-decoration: none;
}

.logo {
  width: 100px;
  height: 100px
}

</style>
