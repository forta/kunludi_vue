<template>
  <div class="games">

  <br/><br/><br/>
	<div v-if="!gameloaded">
    <div v-if=" (userId !== '') ">
        <p>{{kt("Username")}}: {{ userId }}</p>
    </div>

        <p>{{kt("Choose Game")}}</p>
        <ul class="gameList">
            <li v-for="game in games" class="gameList">
               <button v-on:click="currentgame=game"> -> </button> {{translatedGameName (game.name)}}
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
	import { getKTranslator, getUserId, getGameId, getGames, getLocale } from '../vuex/getters'
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

    if (this.$router.app.$route.params.gameId2 != undefined) {
        console.log ("From path: " + this.$router.app.$route.params.gameId2)
        this.$data.currentgame = {name:this.$router.app.$route.params.gameId2}
    }
  },
  methods: {
      gameIsInLocale: function (gameId) {
          for (var i=0; i<this.games.length;i++) {
            if (this.games[i].name == gameId ) {
               for (var j=0; j<this.games[i].about.translation.length;j++) {
                 if (this.games[i].about.translation[j].language == this.locale ) {
                    return {gameIndex: i, translationIndex:j}
                 }
               }
               return {gameIndex: i, translationIndex:undefined}
            }
          }
      },
      translatedGameName: function (gameId) {

          var l = this.gameIsInLocale (gameId)
          if (l == undefined) return gameId
          if (l.translationIndex == undefined)
            return this.games[l.gameIndex].about.translation[0].title + " (" + this.games[l.gameIndex].about.translation[0].language + ")"

          return this.games[l.gameIndex].about.translation[l.translationIndex].title
      }
  },
  store: store,
  vuex: {
    getters: {
       locale: getLocale,
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

body {
    font-size: 2.3em;
}

button {
    border-radius: 10px;
    font-size: 1em;
}

.gameList {
  text-align: left;
}

button:hover {
    background-color: #4CAF50; /* Green */
    border-radius: 10px;
    color: white;
}


ul.gameList {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li.gameList {
  font: 200 20px/1.5 Helvetica, Verdana, sans-serif;
  border-bottom: 1px solid #ccc;
  font-size: 1em;
}

li.gameList:last-child {
  border: none;
}

@media screen  and (min-device-width: 1200px)  and (max-device-width: 1600px)  and (-webkit-min-device-pixel-ratio: 1),
       screen  and (min-device-width: 1200px)  and (max-device-width: 1600px)  and (-webkit-min-device-pixel-ratio: 2)  and (min-resolution: 192dpi) {

 body {
     font-size: 1em;
 }

 button {
     border-radius: 10px;
     font-size: 1em;
 }

 li.gameList {
   font-size: 1em;
 }

}


</style>
