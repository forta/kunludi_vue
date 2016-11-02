<template>

  <div id= "play" class="play">
  
  <div id= "play_top" class="play_top">
  
        <button v-on:click="seeGamePanel()"> {{kt("bottom")}}  </button>

        <h2>{{kt("History")}}</h2>
        <div v-for="hItem in history">
            <!-- echo -->
            <p><b><span v-if ="hItem.gameTurn > 0"> {{hItem.gameTurn}} #</span>{{choiceToShow(hItem.action, true)}}</b></p>
                <!-- to-do: problem with nested v-for: so, we'll create a new component -->  
            
            <span v-for="r in hItem.reactionList">
                <span>{{{formatReaction(r)}}}</span> 
            </span>
        </div>
        <!--<h3> menu: {{menu | json}}</h3> 
        <h3> pendingChoice: {{pendingChoice | json}}</h3> -->
    </div>

  </div>



  <div  id="play_bottom" class="play_bottom">
  
    <!-- Groups of choices -->
    <div class="mainChoices"  v-if = "menu.length == 0  && currentChoice.choiceId != 'quit'">
        <h3> {{kt("Location")}}: {{this.tge("items", gameState.userState.loc, "txt")}} </h3>
        <span v-for="choice in choices">
            <button v-if ="choice.choiceId == 'top'"  class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)"> {{choiceToShow(choice, false)}} </button>
            <button v-if ="choice.choiceId == 'itemGroup'"  class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)"> {{choiceToShow(choice, false)}} </button>
            <button v-if ="choice.choiceId == 'directActions' "  class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)"> {{choiceToShow(choice, false)}}</button>
            <button v-if ="choice.choiceId == 'directionGroup' "  class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)">{{choiceToShow(choice, false)}}</button>
        </span>
        
    </div>
  
    
    <!-- choices -->
    <div class="choices" v-if = "menu.length == 0  && currentChoice.choiceId != 'quit'"> 
        <h3> <!-- <button class={{getChoiceClass(currentChoice.parent)}} v-on:click="doGameChoice(currentChoice.parent)"> {{kt("Back")}} </button>--> {{showCurrentChoice()}}</h3> 
        <!--<h2>{{currentChoice | json}}</h2>-->
        
        <span v-for="choice in choices">
            <button v-if = isMiddleChoice(choice) class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)">{{choiceToShow(choice, false)}}</button>
        </span>

    </div>
    
    <div class="menu" v-if = "menu.length > 0"> 
        <h3> {{kt("Action")}}: {{choiceToShow(pendingChoice)}}</h3>
        <ul>
            <span v-for="m in menu">
            <li><button v-on:click="menuOption(menu, m)">  {{ $index + 1}} - {{tge("messages",m.msg,"txt")}}</button></li>
            </span>
        </ul>
        
    </div>
  
  </div>
  
  </div>


</template>

<script>


    import store from '../vuex/store'
    import { getEcho, getGTranslator, getKTranslator, getCurrentChoice, getGameState, translateGameElement, getGameId, getLocale, getHistory, getMenu, getPendingChoice, getChoices } from '../vuex/getters'
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
      formatReaction: function (r) {
          var piece = this.t(r)
          if (piece == undefined) return ""
          // console.log ('piece: ' + JSON.stringify (piece))
     	  if (piece.isLink) 
		      return "<a href='" + require("./../../data/games/" + this.gameId + "/images/" + piece.src) + "' target='_blank'>" + piece.txt + "</a><br/>"
            // piece.isLocal, 
            // piece.param)
                    
          if (piece.type == "img")
              return  "<p>" + piece.txt + "</p><img src='" + require("./../../data/games/" + this.gameId + "/images/" + piece.src) + "'/><br/>"
          
          return piece.txt
      },           
      isMiddleChoice: function (choice) {
         return ((choice.choiceId == 'action0') ||(choice.choiceId == 'action') ||(choice.choiceId == 'action2') || (choice.choiceId == 'obj1') || (choice.choiceId == 'dir1'))
      },           
      getChoiceClass: function (choice) {

          if (choice.choiceId == 'action0') return "choiceDA"  
          if (choice.choiceId == 'action') return "choiceAction"  
          else if (choice.choiceId == 'action2')  return "choiceAction2"
          else if (choice.choiceId == 'obj1') return "choiceObj1" + "_" + choice.parent
          else if (choice.choiceId == 'dir1') return "choiceDir1"
          else if (choice.choiceId == 'itemGroup') return 'choiceIG' + "_" + choice.itemGroup
          else if (choice.choiceId == 'directActions') return 'choiceDA'
          else if (choice.choiceId == 'directionGroup') return 'choiceDirections'
          return ""
      },
      choiceToShow: function (choice, isEcho) { 
          return this.echo (choice, isEcho)

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
            //var elem = document.getElementById("play_bottom")
            // elem.scrollIntoView(true)
            
            setTimeout(function(){ 
            var elem = document.getElementById("play_bottom")
            if (elem != null) 
                //elem.scrollTop =  elem.scrollHeight
                elem.scrollIntoView(true)
            	
            }, 100);
             
      },
      doGameChoice(choice) {
          store.dispatch('PROCESS_CHOICE', choice)
          this.showEndOfText()
      },
      menuOption(menu, m) {
          var choice = this.pendingChoice
          choice.action.option = m.id 
          choice.action.msg = m.msg
          choice.action.menu = menu
          store.dispatch('SET_PENDING_CHOICE', choice)
          this.showEndOfText()
      },
      seeGamePanel() {
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
       menu: getMenu,
       pendingChoice: getPendingChoice,
       kt: getKTranslator,
       t: getGTranslator,
       tge: translateGameElement,
       currentChoice: getCurrentChoice,
       gameState: getGameState,
       echo: getEcho
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

/*
button {
    border-radius: 10px;
    font-size: 16px;

}
*/

button {
    border-radius: 10px;
    font-size: 16px;

}

@media screen and (max-width: 1000px) {
    button {
        border-radius: 10px;
        font-size: 32px;
    }
}

button:hover {
    background-color: #4CAF50; /* Green */
    border-radius: 10px;
    color: white;
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

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  font: 200 20px/1.5 Helvetica, Verdana, sans-serif;
  border-bottom: 1px solid #ccc;
}
 
li:last-child {
  border: none;
}

div.play {
    overflow: hidden;
    height:100%
}

div.play_top {

    //border: 1px solid green;
    position: relative; 
    top: 0;
    right: 0;
 	overflow: scroll;		
    text-align: left;
	background-color:#FFF;
}		

div.play_bottom {
    position: relative; 
    //border: 1px solid gray;
    buttom: 0;
    right: 0;
    // border: 3px solid #73AD21;
}


div.mainChoices {
	background-color: #FFE;
}

div.choices {
       	/*height: 120px;*/
	background-color: #FFD;
    text-align: center;
}

 
 

</style>
