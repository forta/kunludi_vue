<template>
    <div class="ludi" id="ludi">

        <div class="ludi_top1">

            <h2> <a v-link="{ path: '/kune' }"> {{kt("Together")}} | </a>
            {{kt("Play")}} |
            <a v-link="{ path: '/lingvo' }"> {{kt("Language")}} </a></h2>

            
            <a v-show="!gameId" v-link="{ path: '/ludi/games' }"> {{kt("Games")}} | </a>
            <a v-link="{ path: '/ludi/about' }"> {{kt("About")}} | </a>
            
            <h2 v-show="gameId"> {{kt("Playing")}}: {{gameId}} </h2> 
            <a v-show="gameId" v-link="{ path: '/ludi/play' }"> {{kt("Play")}} | </a>
            <a v-show="gameId" v-link="{ path: '/ludi/more' }"> {{kt("More")}} | </a>
            <a v-show="gameId" v-on:click="quit">  {{kt("Quit")}} | </a>
            
        </div>

       <div class="ludi_bottom" id="ludi_bottom">

            <router-view></router-view>
        
        </div>
        
        
        <div class="ludi_top2">

            <h4> <a v-link="{ path: '/kune' }"> {{kt("Together")}} | </a>
            {{kt("Play")}} |
            <a v-link="{ path: '/lingvo' }"> {{kt("Language")}} </a></h4>

            
            <a v-show="!gameId" v-link="{ path: '/ludi/games' }"> {{kt("Games")}} | </a>
            <a v-link="{ path: '/ludi/about' }"> {{kt("About")}} | </a>
            
            <h4 v-show="gameId"> {{kt("Playing")}}: {{gameId}} </h4> 
            <a v-show="gameId" v-link="{ path: '/ludi/play' }"> {{kt("Play")}} | </a>
            <a v-show="gameId" v-link="{ path: '/ludi/more' }"> {{kt("More")}} | </a>
            <a v-show="gameId" v-on:click="quit">  {{kt("Quit")}} | </a>
            
        </div>

       
        
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
 // height: 100%;
}

body {
  display: flex;
  justify-content: center;
  height: 100%;
}

#app {
  color: #2c3e50;
  /*max-width: 600px;*/
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: center;
}

#app a {
  color: #42b983;
  text-decoration: none;
}

div.ludi {
    overflow: hidden;
    height: 100%;
    width: 100%;
    //border: 1px solid gray;    
}

div.ludi_top1 {
   left: 0px; 
   top: 0px;
   width: 100%;
   border: 1px solid red;
}		

div.ludi_top2 {
    position: relative;
    border: 1px solid red;
}		

div.ludi_bottom {
    position: relative;
    //border: 1px solid yellow;
}		
		

</style>
