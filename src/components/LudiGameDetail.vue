<template>
  <div class="ludi-game-detail"  v-show='game.name'>
    <h3>{{kt("Details")}}</h3>
    <ul>
        <li> {{kt("Id")}}: {{game.name}} </li>
        <!--
         <li> Type: {{game.type}} </li>
        <li> Group: {{game.group}} </li>
        <li> Url: {{game.baseurl}} </li>
        -->
        <li> <label>{{kt("Language")}}:</label>
            <select v-model="languageIndex">
            <option v-for="option in about.translation" v-bind:value="$index">
                {{ option.language }}
            </option>
            </select>
        </li>
        <div v-if="languageIndex >= 0 ">
            <li> {{kt("Title")}}: {{about.translation[languageIndex].title}} </li>
            <li> {{kt("Description")}}: {{about.translation[languageIndex].desc}} </li>
            <li> {{kt("Introduction")}}: {{about.translation[languageIndex].introduction}} </li>
            <li> {{kt("Author")}}: {{about.translation[languageIndex].author.name}}
                    ({{kt("ludi account")}}: {{about.translation[languageIndex].author.ludi_account}})
                ({{kt("email")}}: {{about.translation[languageIndex].author.email}})</li>
         <div>
    </ul>

    <div v-if="languageIndex >= 0 && about.translation[languageIndex].desc != '??'">

        <h3>{{kt("Options")}}</h3>
        <ul>

          <!-- offline game states -->
          <div v-if=" (userId === '') ">

            <!-- offline default state -->
            <li><button v-on:click="loadGame(game.name, 'default', about.translation[languageIndex].language)"> {{kt("LoadGameFromStart")}}  </button></li>

            <h3>{{kt("Private game states of the user")}}:</h3>
            <li v-for="gameSlot in gameSlots" >
              <span v-if="gameSlot.id!='default'">
                <button  v-on:click="loadGame(game.name, gameSlot.id, about.translation[languageIndex].language)"> {{kt("LoadGame")}}  </button>
                 [{{gameSlot.slotDescription}}]
                 <button v-on:click="renameGameSlot(gameSlot.id, gameSlot.slotDescription)"> {{kt("Rename")}} </button>
                 - {{kt("Turns")}}: {{gameSlot.gameTurn}} - {{kt("Date")}}: {{convertDate(gameSlot.date)}}
                 <button v-on:click="deleteGameSlot(gameSlot.id)"> {{kt("Delete")}} </button>
                 <br/>
              </span>
            </li>

          </div>

          <!-- online game states -->
          <div v-else>

            <h3>{{kt("Private game states of the user")}}:</h3>
            <li v-for="gameSlot in gameSlots" >

            <!-- no default / stored -->
            <span v-if="gameSlot.type=='stored'">
              <button  v-on:click="loadGame(gameSlot.id)">{{kt("LoadGame")}}</button>
               [{{gameSlot.slotDescription}}]
               <button v-on:click="renameGameSlot(gameSlot.id, gameSlot.slotDescription)"> {{kt("Rename")}} </button>
               - {{kt("Turns")}}: {{gameSlot.gameTurn}} - {{kt("Date")}}: {{convertDate(gameSlot.date)}}
               <button v-on:click="deleteGameSlot(gameSlot.id)"> {{kt("Delete")}} </button>
               <br/>
            </span>
            </li>

            <h3>{{kt("The game is being played in group in these server sessions")}}:</h3>
            <li v-for="gameSlot in gameSlots" >
              <span v-if="gameSlot.type=='live'">
                <button  v-on:click="loadGame(game.name, gameSlot.id, about.translation[languageIndex].language)">   {{kt("JoinGame")}}  </button>
                [{{gameSlot.slotDescription}}]
                 - {{kt("Turns")}}: {{gameSlot.gameTurn}} - {{kt("Date")}}: {{convertDate(gameSlot.date)}}
                 <span v-if="gameSlot.playerList.length>0">
                   - {{kt("Players")}}: {{gameSlot.playerList.length}} =>  <span v-for="player in gameSlot.playerList"> {{player}} </span>
                 </span>
                 <span v-if="gameSlot.gameTurn>0 && gameSlot.playerList.length==0">
                   <button v-on:click="reseteGameSlot(game.name, gameSlot.id, about.translation[languageIndex].language)"> {{kt("ResetGame")}} </button>
                 </span>
                 <br/>
              </span>

              </li>
            </div>
          </ul>

     </div>

  </div>
</template>

<script>

    import store from '../vuex/store'
    import { getGameAbout, getGameId, getUserId, getLocale, getKTranslator, getGameSlots } from '../vuex/getters'
    import * as actions from '../vuex/actions'

export default {
  data () {

    return {
        languageIndex: -1
    }
  },
  watch: {
     'game': function (val, oldVal) {
        store.dispatch('LOAD_GAME_ABOUT', val.name)
        // store.dispatch('LOAD_GAME_SLOTS', val.name)
        // show current local in the language combobox
        var i=0
        for (; i<this.about.translation.length;i++) {
            if (this.about.translation[i].language == this.locale) {
                this.languageIndex=i
                break
            }
        }
        // not necessary, but...
        if ( i==this.about.translation.length) this.languageIndex=0
     }
  },
  computed: {
  },
  methods: {
      loadGame: function (id, slotId, newLocal) {
		      store.dispatch('SETGAMEID', id, slotId, newLocal)
      },
      convertDate: function (dateJSON) {
          var d = new Date (JSON.parse (dateJSON))
		      return d.toLocaleString()
      },
      deleteGameSlot: function (slotId) {
		      store.dispatch('DELETE_GAME_STATE', slotId)
      },
      renameGameSlot: function (slotId, oldDescription) {
          let newSlotDescription = prompt ("Description", oldDescription) // to-do: translation
	        store.dispatch('RENAME_GAME_STATE', slotId, newSlotDescription)
      }
  },
  props: ['game'],
  store: store,
  vuex: {
    getters: {
       gameId: getGameId,
       userId: getUserId,
       locale: getLocale,
       about: getGameAbout,
       kt: getKTranslator,
       gameSlots: getGameSlots
    },
    actions: actions
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h3 {
  color: #42b983;
  text-align: center;
}

.ludi-game-detail {
  text-align: left;

}

button:hover {
    background-color: #4CAF50; /* Green */
    border-radius: 10px;
    color: white;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  font: 200 20px/1.5 Helvetica, Verdana, sans-serif;
  border-bottom: 1px solid #ccc;
  text-align: left;
}

li:last-child {
  border: none;
}

button {
    border-radius: 10px;
    font-size: 1em;
}

body {
    font-size: 1em;
}

h3,li, button {
  font-size: 1em;
}

</style>
