<template>
  <div id= "play" class="play">
    <h2>History</h2>
    <div v-for="hItem in history">
        <p><b> {{$index+1}}. {{hItem.action.actionId}}</b></p>
            <!-- to-do: problem with nested v-for: so, we'll create a new component -->   
            <span v-for="r in hItem.reactionList"> {{t(r.detail)}} </span>
    </div>
  </div>
    
  <div class="choices">
    <h2>Choices</h2>
    <div v-for="choice in choices">
        <button v-on:click="doGameChoice(choice)">{{choice.actionId}}</button>   
    </div>
    
  </div>
</template>

<script>


    import store from '../vuex/store'
    import { getTranslator, getGameId, getGameMsg, getGameItem, getLocale, getHistory, getChoices } from '../vuex/getters'
    import * as actions from '../vuex/actions'


export default {
data () {
    return {
    }
  },
  methods: {
      doGameChoice(choice) {
          store.dispatch('PROCESS_CHOICE', choice)
          setTimeout(function(){ 
              var elem = document.getElementById("play")
              if (elem != null) 
		            elem.scrollTop =  elem.scrollHeight	
          }, 100);  
        
      } 
  },
  store: store,
  vuex: {
    getters: {
       gameId: getGameId,
       gameMsg: getGameMsg,
       gameItem: getGameItem,
       locale: getLocale,
       history: getHistory,
       choices: getChoices,
       t: getTranslator
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

.play {
   	height: 200px;
	background-color: #EFC;
 	overflow: scroll;		
}		

.choices {
   	height: 200px;
	background-color: #AFC;
 	overflow: scroll;		
}

</style>
