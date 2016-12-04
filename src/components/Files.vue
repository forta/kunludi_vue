<template>
  <div class="files">

	<h3>{{kt("Files")}}</h3>

    <ul>
        <li> <b>{{kt("Title")}}:</b> {{about.translation[languageIndex].title}} </li>
        <li> <b>{{kt("Description")}}:</b> {{about.translation[languageIndex].desc}} </li>
        <li> <b>{{kt("Introduction")}}:</b> {{about.translation[languageIndex].introduction}} </li>
        <li> <b>{{kt("Language")}}:</b> <span v-for="lan in about.translation" > {{lan.language | json }} </span> </li>
        <li> <b>{{kt("Author")}}:</b> {{about.translation[languageIndex].author.name}}
                (<b>{{kt("ludi account")}}:</b> {{about.translation[languageIndex].author.ludi_account}})
            (<b>{{kt("email")}}:</b> {{about.translation[languageIndex].author.email}})</li>
     </ul>

     <h3>{{kt("Options")}} </h3>

     <ul>
         <li> <button @click='quitGame()'>{{kt("Quit")}}</button></li>

         <li> <button @click='saveGame()'>{{kt("SaveGame")}}</button></li>

         <li> <button v-on:click="loadGame('default')"> {{kt("LoadGameFromStart")}}  </button> <br/> </li>

         <li v-for="gameSlot in gameSlots" >
           <span v-if="gameSlot.id!='default'">
             <button  v-on:click="loadGame(gameSlot.id)"> {{kt("LoadGame")}}  </button>
              [{{gameSlot.slotDescription}}]
              <button v-on:click="renameGameSlot(gameSlot.id, gameSlot.slotDescription)"> {{kt("Rename")}} </button>
              - {{kt("Turns")}}: {{gameSlot.gameTurn}} - {{kt("Date")}}: {{convertDate(gameSlot.date)}}
              <button v-on:click="deleteGameSlot(gameSlot.id)"> {{kt("Delete")}} </button>
              <br/>
           </span>
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
         let slotDescription = prompt ("Description") // to-do: translation
         store.dispatch('SAVE_GAME_STATE', slotDescription)
         // go back playing:  path:  /ludi/files -> /ludi/play
         this.$router.go('/ludi/play')
     },
     loadGame: function (slotId) {
         store.dispatch('LOAD_GAME_STATE', slotId)
         // go back playing:  path:  /ludi/files -> /ludi/play
         this.$router.go('/ludi/play')
     },
     loadGameState2: function (slotId) {
         store.dispatch('LOAD_GAME_STATE', slotId)
         // go back playing:  path:  /ludi/files -> /ludi/play
         this.$router.go('/ludi/play')
     },
      deleteGameSlot: function (slotId) {
		  store.dispatch('DELETE_GAME_STATE', slotId)
      },
      renameGameSlot: function (slotId, oldDescription) {
          let newSlotDescription = prompt ("Description", oldDescription) // to-do: translation

		  store.dispatch('RENAME_GAME_STATE', slotId, newSlotDescription)
      },
      convertDate: function (dateJSON) {
          var d = new Date (JSON.parse (dateJSON))
		  return d.toLocaleString()
      },
      quitGame: function () {
          if (confirm (this.kt ("Confirm game quit"))) {
              store.dispatch('RESETGAMEID')
              this.$router.go('/ludi/about')
          }
      }
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

button {
    border-radius: 10px;
    font-size: .8em;
}

button:hover {
    background-color: #4CAF50; /* Green */
    border-radius: 10px;
    color: white;
}

/* Portrait */
@media screen
  and (-webkit-device-pixel-ratio: 2)
  and (orientation: portrait) {

    button {
        border-radius: 10px;
        font-size: .5em;
    }

}

/* Landscape */
@media screen
  and (-webkit-device-pixel-ratio: 2)
  and (orientation: landscape) {

    button {
        border-radius: 10px;
        font-size: 0.9em;
    }

}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  font: 200 20px/1.5 Helvetica, Verdana, sans-serif;
  border-bottom: 1px solid #ccc;
  font-size: 20px;
}

li:last-child {
  border: none;
}


</style>
