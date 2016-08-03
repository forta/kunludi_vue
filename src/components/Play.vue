<template>
  <div id= "play" class="play">
    <h2>{{kt("History")}}</h2>
    <div v-for="hItem in history">
        <!-- echo -->
        <p><b> {{$index+1}}. {{choiceToShow(hItem.action)}}</b></p>
            <!-- to-do: problem with nested v-for: so, we'll create a new component -->   
            <span v-for="r in hItem.reactionList"> {{{t(r)}}} </span>
    </div>
  </div>
    
  <!-- Groups of choices -->
  <div class="mainChoices">
    <span v-for="choice in choices">
        <button v-if ="choice.choiceId == 'top'"  class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)"> {{choiceToShow(choice)}} </button>
        <button v-if ="choice.choiceId == 'itemGroup'"  class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)"> {{choiceToShow(choice)}} </button>
        <button v-if ="choice.choiceId == 'directActions' "  class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)"> {{choiceToShow(choice)}}</button>
        <button v-if ="choice.choiceId == 'directionGroup' "  class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)">{{choiceToShow(choice)}}</button>
    </span>
    
  </div>
    
  <!-- choices -->
  <div class="choices">
     <h3> <!-- <button class={{getChoiceClass(currentChoice.parent)}} v-on:click="doGameChoice(currentChoice.parent)"> {{kt("Back")}} </button>--> {{showCurrentChoice()}}</h3> 
     <!--<h2>{{currentChoice | json}}</h2>-->
    
    <span v-for="choice in choices">
        <button v-if = isMiddleChoice(choice) class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)">{{choiceToShow(choice)}}</button>
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
      isMiddleChoice: function (choice) {
         return ((choice.choiceId == 'action') ||(choice.choiceId == 'action2') || (choice.choiceId == 'obj1') || (choice.choiceId == 'dir1'))
      },           
      getChoiceClass: function (choice) {

          if (choice.choiceId == 'action') return (choice.parent == "directActions")?"choiceDA":"choiceAction"  
          else if (choice.choiceId == 'action2')  return "choiceAction2"
          else if (choice.choiceId == 'obj1') return "choiceObj1" + "_" + choice.parent
          else if (choice.choiceId == 'dir1') return "choiceDir1"
          else if (choice.choiceId == 'itemGroup') return 'choiceIG' + "_" + choice.itemGroup
          else if (choice.choiceId == 'directActions') return 'choiceDA'
          else if (choice.choiceId == 'directionGroup') return 'choiceDirections'
          return ""
      },
      choiceToShow: function (choice) { // it shoud be an vuex function
          if (choice.choiceId == 'action') return  this.tge("actions", choice.action.actionId)
          else if (choice.choiceId == 'action2') return this.tge("actions", choice.action.actionId) + " -> " + this.tge("items", choice.action.item1, "txt")
          else if (choice.choiceId == 'obj1') return this.tge("items", choice.item1, "txt")
          
          // to-do: target only if known
          else if (choice.choiceId == 'dir1') return this.tge("directions", choice.action.d1, "txt") + " -> " + this.tge("items", choice.action.target, "txt")
          
          else if (choice.choiceId == 'itemGroup') return this.kt("mainChoices_" +  choice.itemGroup)
          else if (choice.choiceId == 'directActions') return this.kt("mainChoices_" + choice.choiceId)
          else if (choice.choiceId == 'directionGroup') return this.kt("mainChoices_" + choice.choiceId)
          else if (choice.choiceId == 'top') return this.kt("mainChoices_" + choice.choiceId)
          return ""

      },
      decodeHtml: function (html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
      },
      showCurrentChoice: function () {
           console.log ("current choice on play.vue: " + JSON.stringify (this.currentChoice))
           
           return this.choiceToShow (this.currentChoice)
	   
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

.choiceIG_here {
	background-color: #40FF00;
}
.choiceObj1_here {
	background-color: #40FF00;
}
.choiceIG_carrying {
	background-color: #FFFF00;
}
.choiceObj1_carrying {
	background-color: #FFFF00;
}
.choiceIG_notHere {
	background-color: #FF0000;
}
.choiceObj1_notHere {
	background-color: #FF0000;
}

.choiceDA {
	background-color: #DF7400;
}

.choiceDirections {
	background-color: #2EFEF7;
}
.choiceDir1 {
	background-color: #2EFEF7;
}

.choiceAction {
	background-color: #FCA;
}

.choiceAction2 {
	background-color: #FE2E64;
}


</style>
