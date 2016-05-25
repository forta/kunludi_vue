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
    <span v-for="choice in choices">
        <button v-if ="choice.choiceId == 'top' " class='choiceTop' v-on:click="doGameChoice(choice)">Top</button>
        <button v-if ="choice.choiceId == 'action' " class='choiceAction' v-on:click="doGameChoice(choice)">{{choice.action.actionId}}</button>
        <button v-if ="choice.choiceId == 'itemGroup'" class='choiceIG' v-on:click="doGameChoice(choice)">{{choice.itemGroup}}</button>
        <button v-if ="choice.choiceId == 'directActions' " class='choiceDA' v-on:click="doGameChoice(choice)">Direct Actions</button>
        <button v-if ="choice.choiceId == 'obj1' " class='choiceObj1' v-on:click="doGameChoice(choice)">{{choice.item}}</button>
    </span>
    
  </div>
</template>

<script>


    import store from '../vuex/store'
    import { getTranslator, getGameId, getLocale, getHistory, getChoices } from '../vuex/getters'
    import * as actions from '../vuex/actions'


export default {
data () {
    return {
    }
  },
  created: function () {
    this.showEndOfText()
  },
  methods: {
      showEndOfText: function () {
        setTimeout(function(){ 
            var elem = document.getElementById("play")
            if (elem != null) 
                elem.scrollTop =  elem.scrollHeight	
            }, 100);  
      },
      doGameChoice(choice) {
          store.dispatch('PROCESS_CHOICE', choice)
          this.showEndOfText()
      } 
  },
  store: store,
  vuex: {
    getters: {
       gameId: getGameId,
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

.choiceTop {
	background-color: #DAA;
}

.choiceAction {
	background-color: #FCA;
}

.choiceDA {
	background-color: #ACA;
}

.choiceIG {
	background-color: #DCA;
}
.choiceObj1 {
	background-color: #BFA;
}

</style>
