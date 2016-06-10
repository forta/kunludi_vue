<template>
  <div class="games">

	<div v-if="!gameloaded">
        <p>{{kt("Choose Game")}}</p>
        <ul class="gameList">
            <li v-for="game in games">
               <button v-on:click="currentgame=game"> -> </button> {{game.name}}   
            </li>
        </ul>

<!--
        <h4>Filters</h4>
        <input type="checkbox" id="checkbox" v-model="filterOnDevelopment"> <label>On development</label> | 
        <label>By languages:</label>
        <select v-model="filterByLang">
            <option selected>Current</option>
            <option>My language favourites</option>
            <option>Any Language</option>
        </select>
-->
        <ludi-game-detail :game="currentgame"></ludi-game-detail>
	</div>
	<div v-else>
		<play>
	</div>
    
  </div>
</template>

<script>

	import store from '../vuex/store'
	import { getKTranslator, getUserId, getGameId, getGames } from '../vuex/getters'
	import * as actions from '../vuex/actions'


    import LudiGameDetail from './LudiGameDetail.vue'
    import Play from './Play.vue'


export default {
    
   components: {
        LudiGameDetail, Play
   },
   
  data () {
	  
    return {
      currentgame: {},
      filterOnDevelopment: false,
      filterByLang: 'Current',
    }
  },  
  computed: {
     gameloaded: function () { return (this.gameId !== ""); }    
  },
  ready: function(){
    // each time, the game list is loaded
    if (!this.gameloaded)  store.dispatch('LOADGAMES')
  },
  methods: {
  },
  store: store,
  vuex: {
    getters: {
       userId: getUserId,
       gameId: getGameId,
       games: getGames,
       kt: getKTranslator
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

.gameList {
  text-align: left;
}

</style>



