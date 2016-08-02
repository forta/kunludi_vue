<template>
  <div id= "play" class="play">
    <h2>{{kt("History")}}</h2>
    <div v-for="hItem in history">
        <p><b> {{$index+1}}. {{hItem.action.actionId}}</b></p>
            <!-- to-do: problem with nested v-for: so, we'll create a new component -->   
            <span v-for="r in hItem.reactionList"> {{{t(r)}}} </span>
    </div>
  </div>
    
  <!-- Groups of choices -->
  <div class="mainChoices">
    <span v-for="choice in choices">
        <button v-if ="choice.choiceId == 'itemGroup'" class='choiceIG' v-on:click="doGameChoice(choice)">{{choice.itemGroup}}</button>
        <button v-if ="choice.choiceId == 'directActions' " class='choiceDA' v-on:click="doGameChoice(choice)">Direct Actions</button>
        <button v-if ="choice.choiceId == 'directionGroup' " class='choiceDirections' v-on:click="doGameChoice(choice)">Directions</button>
    </span>
    
  </div>
    
  <!-- choices -->
  <div class="choices">
     <h2>{{showCurrentChoice()}}</h2> 
     <!--<h2>{{currentChoice | json}}</h2>-->
    
    <span v-for="choice in choices">
        <button v-if ="choice.choiceId == 'action' " class='choiceAction' v-on:click="doGameChoice(choice)">{{tge("actions", choice.action.actionId)}}</button>
        <button v-if ="choice.choiceId == 'action2' " class='choiceAction2' v-on:click="doGameChoice(choice)">{{tge("items", choice.action.item1, "txt")}}: {{tge("actions", choice.action.actionId)}}  to:{{tge("items", choice.action.item2, "txt")}} </button>
        <button v-if ="choice.choiceId == 'obj1' " class='choiceObj1' v-on:click="doGameChoice(choice)">{{tge("items", choice.item1, "txt")}}</button>
        <button v-if ="choice.choiceId == 'dir1' " class='choiceDir1' v-on:click="doGameChoice(choice)">{{tge("directions", choice.action.d1, "txt")}}: {{tge("items", choice.action.target, "txt")}}</button>
    </span>
    
  </div>
</template>

<script>


    import store from '../vuex/store'
    import { getGTranslator, getKTranslator, getCurrentChoice, translateGameElement, getGameId, getLocale, getHistory, getChoices } from '../vuex/getters'
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
      decodeHtml: function (html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
      }, showCurrentChoice: function () {
           let choice = this.currentChoice 
		   
           //console.log ("current choice on play.vue: " + JSON.stringify (choice))

		   if (choice.choiceId == 'itemGroup') return this.kt(choice.choiceId + "." + choice.itemGroup)
          else if (choice.choiceId == 'directActions') return this.kt(choice.choiceId)
          else if (choice.choiceId == 'directionGroup') return this.kt(choice.choiceId)
          else if (choice.choiceId == 'obj1') return this.tge("items", choice.item1, "txt")
          else if (choice.choiceId == 'action2') return this.tge("items", choice.action.item1, "txt") + ": " + this.tge("actions", choice.action.actionId, "txt") + " -> " + this.tge("items", choice.action.item2, "txt") 
          else if (choice.choiceId == 'dir1') return this.tge("directions", choice.action.d1, "txt")
          return "" // to-do
      }, 
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
       kt: getKTranslator,
       t: getGTranslator,
       tge: translateGameElement,
       currentChoice: getCurrentChoice
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
   	height: 400px;
	background-color:#FFF;
 	overflow: scroll;		
    text-align: left;
}		

.mainChoices {
	background-color: #FFE;
}

.choices {
   	/*height: 120px;*/
	background-color: #FFD;
 	overflow: scroll;	
}

.choiceTop {
	background-color: #DAA;
}

.choiceAction {
	background-color: #FCA;
}

.choiceAction2 {
	background-color: #BDA;
}

.choiceDA {
	background-color: #ACA;
}

.choiceDirectios {
	background-color: #ADA;
}

.choiceIG {
	background-color: #DCA;
}
.choiceObj1 {
	background-color: #BFA;
}

</style>
