<template>
  <div class="more">

	<h3>{{kt("Details")}}</h3>

    <ul>
        <li> <b>{{kt("Title")}}:</b> {{about.translation[languageIndex].title}} </li>
        <li> <b>{{kt("Description")}}:</b> {{about.translation[languageIndex].desc}} </li>
        <li> <b>{{kt("Introduction")}}:</b> {{about.translation[languageIndex].introduction}} </li>
        <li> <b>{{kt("Author")}}:</b> {{about.translation[languageIndex].author.name}}
                (<b>{{kt("ludi account")}}:</b> {{about.translation[languageIndex].author.ludi_account}})
            (<b>{{kt("email")}}:</b> {{about.translation[languageIndex].author.email}})</li>
     </ul>

     <h3>{{kt("File")}} </h3>
     <ul>
         <li> <button @click='saveGame()'>{{kt("SaveGame")}}</button></li>
         
         <li> <button v-on:click="loadGame('default')"> {{kt("LoadGameFromStart")}}  </button> <br/> </li>
           
         <li v-for="gameSlot in gameSlots">
           <button v-on:click="loadGame(gameSlot.id)"> {{kt("LoadGame")}}  </button> {{gameSlot.id}} - {{kt("Turns")}}: {{gameSlot.gameTurn}} - {{kt("Date")}}: {{convertDate(gameSlot.date)}}   <button v-on:click="deleteGameSlot(gameSlot.id)"> {{kt("Delete")}} </button>   <br/>  
         </li>
                    
         <!-- <li> <b>{{kt("SeeHistory")}}</b></li> -->
     </ul>

  </div>
</template>

<script>

import store from '../vuex/store'
import {getKTranslator, getLocale, getGameAbout, getGameId, getGameSlots} from '../vuex/getters'
import * as actions from '../vuex/actions'

export default {
  data () {
    return {
        languageIndex:0
    }
  },
  ready: function () {
      if (this.about.translation == undefined) return
      var languageIndex = 0
      for (var l=0; l<this.about.translation.length;l++) if (this.about.translation[l].language == this.locale) languageIndex = l
      this.languageIndex = languageIndex
  },
  methods: {
     saveGame: function () {
         store.dispatch('SAVE_GAME_STATE')
         // go back playing:  path:  /ludi/more -> /ludi/play
         this.$router.go('/ludi/play') 
     },
     loadGame: function (slotId) {
         store.dispatch('LOAD_GAME_STATE', slotId)
         // go back playing:  path:  /ludi/more -> /ludi/play
         this.$router.go('/ludi/play') 
     },
     loadGameState2: function (slotId) {
         store.dispatch('LOAD_GAME_STATE', slotId)
         // go back playing:  path:  /ludi/more -> /ludi/play
         this.$router.go('/ludi/play') 
     },
      deleteGameSlot: function (id, slotId) {
		  store.dispatch('DELETE_GAME_SLOT', id, slotId)
      }, 
      convertDate: function (dateJSON) {
          var d = new Date (JSON.parse (dateJSON))
		  return d.toLocaleString()
      }, 
  },
  route: {
    activate: function () {

    }
  },
  store: store,
  vuex: {
    getters: {
       locale: getLocale,
       about: getGameAbout,
       gameId: getGameId,
       kt: getKTranslator,
       gameSlots: getGameSlots
    },
    actions: actions
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

p, li {
    text-align: left;
}

h1 {
  color: #42b983;
}

.login {
  text-align: left;
}

</style>
