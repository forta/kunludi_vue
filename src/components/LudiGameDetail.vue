<template>
  <div class="ludi-game-detail"  v-show='game.name'>
    <h3>{{kt("Details")}}</h3>
    <ul>
        <li> {{kt("Name")}}: {{game.name}} </li>
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

    <h3>{{kt("Options")}}</h3>
    <ul>
    <li>
    <button v-on:click="load(game.name)">{{kt("Load game")}}</button>   
    </li>
    </ul>

  </div>
</template>

<script>

    import store from '../vuex/store'
    import { getGameAbout, getGameId, getLocale, getKTranslator } from '../vuex/getters'
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
        this.languageIndex=0
     }
  },
  computed: {
  },
  methods: {
      load: function (id) {
		  store.dispatch('SETGAMEID', id)
      }, 
  },
  props: ['game'],
  store: store,
  vuex: {
    getters: {
       gameId: getGameId,
       locale: getLocale,
       about: getGameAbout,
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

.ludi-game-detail {
  text-align: left;
    
}

</style>



