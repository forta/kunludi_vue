<template>

  <div id= "play" class="play">

    <div id= "play_top" class="play_top">

        <button v-on:click="seeGamePanel()" > {{kt("bottom")}}  </button>

        <h2>{{kt("History")}}</h2>
        <div v-for="hitem in history">
            <!-- echo -->


            <p><b><span v-if ="hitem.gameTurn > 0"> {{hitem.gameTurn}} &gt; </span>{{choiceToShow(hitem.action, true)}}</b>
            <!--[Debug: {{hitem.gameTurn}} &gt; {{choiceToShow(hitem.action, true)}}]-->
            </p>

            <!-- to-do: problem with nested v-for: so, we'll create a new component -->
            <!-- <reaction :hitem="hitem"></reaction> -->

            <span v-for="r in hitem.reactionList">
                {{{formatReaction(r)}}}
            </span>

        </div>

        <div class="reactionList" v-if = "lastAction != undefined">
          <!-- <h2>{{kt("ReactionList")}}</h2> -->
  		    <!-- echo -->
  		    <p><b>{{actionToShow(lastAction, true)}}</b></p>

      		<span v-for="r in reactionList">
      			{{{formatReaction(r)}}}
      		</span>
        </div>

    </div>

  </div>

  <div  id="play_bottom" class="play_bottom" &&  v-if ="!gameIsOver">

    <!-- press key -->
    <div v-if = "pendingPressKey">
       <button v-on:click="pressAnyKey()" > {{pressKeyMessage}}  </button>
    </div>

    <!-- choices (not menu nor presskey) -->
    <div v-if = "!pendingPressKey && menu.length == 0  && currentChoice.choiceId != 'quit'" >

      <div class="mainChoices" >
          <h3> {{kt("Location")}}: {{this.tge("items", gameState.userState.loc, "txt")}} </h3>
          <span v-for="choice in choices">
              <span v-if ="choice.choiceId == 'itemGroup'"  class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)"> {{choiceToShow(choice, false)}} </span>
              <span v-if ="choice.choiceId == 'directActions' "  class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)"> {{choiceToShow(choice, false)}} </span>
              <span v-if ="choice.choiceId == 'directionGroup' "  class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)"> {{choiceToShow(choice, false)}} </span>
          </span>

      </div>

  	<hr/>

  	  <!-- direct actions -->
      <div class="choices">
          <span v-for="choice in choices">
              <button v-if = "(choice.parent== 'directActions') && (choice.action.actionId != 'go')" class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)">{{choiceToShow(choice, false)}}</button>
          </span>
      </div>

  	  <!-- directions -->
      <div class="choices">
          <span v-for="choice in choices">
              <button v-if = "(choice.parent== 'directActions') && (choice.action.actionId == 'go')" class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)">{{choiceToShow(choice, false)}}</button>
          </span>
      </div>

  	  <!-- items Here -->
      <div class="choices">
          <span v-for="choice in choices">
              <button v-if = "(choice.parent== 'here')" class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)">{{choiceToShow(choice, false)}}</button>
          </span>
      </div>

  	  <!-- items notHere -->
      <div class="choices">
          <span v-for="choice in choices">
              <button v-if = "(choice.parent== 'notHere')" class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)">{{choiceToShow(choice, false)}}</button>
          </span>
      </div>

      <!-- items Carrying -->
        <div class="choices">
            <span v-for="choice in choices">
                <button v-if = "(choice.parent== 'carrying')" class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)">{{choiceToShow(choice, false)}}</button>
            </span>
        </div>

      <h3>  {{showCurrentChoice()}}</h3>

  	  <!-- items inside -->
      <div class="choices">
          <span v-for="choice in choices">
              <button v-if = "(choice.parent== 'inside')" class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)">{{choiceToShow(choice, false)}}</button>
          </span>
      </div>

  	<!-- actions on selected item -->
      <div class="choices">
          <span v-for="choice in choices">
              <button v-if = "(choice.parent== 'obj1')" class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)">{{choiceToShow(choice, false)}}</button>
          </span>
      </div>

  	<!-- actions2 on items inside -->
      <div class="choices">
          <span v-for="choice in choices">
              <button v-if = "(choice.parent== 'action2')" class={{getChoiceClass(choice)}} v-on:click="doGameChoice(choice)">{{choiceToShow(choice, false)}}</button>
          </span>
      </div>

   </div>

    <!-- menu but not presskey -->
    <div class="menu" v-if = "!pendingPressKey && menu.length > 0">

      <div class="menuPiece"> {{{ formatPiece(menuPiece) }}} </div>

      <div class="menuChoices">
        <h3> {{kt("Action")}}: {{choiceToShow(pendingChoice)}}</h3>
        <ul>
            <span v-for="m in menu">
            <li><button v-on:click="menuOption(menu, m)">  {{ $index + 1}} - {{tge("messages",m.msg,"txt")}}</button></li>
            </span>
        </ul>
      </div>

    </div> <!--menu -->

  </div> <!-- play_bottom -->

  <div class="chatSecton" v-show="userId != ''">
      <button v-on:click="seeChatSection()" > {{kt("Messages")}}  </button>
      <div class="chatSubsecton" v-show="chatVisible">
        <div v-for="c in chatMessages">
            <p><b>{{c.from}}:</b> {{c.msg}}</p>
        </div>
        <b>{{kt("Online Players")}}: </b>
        <span v-for="p in playerList">
            <span><b>{{p.userId}}</b>({{p.locale}}) ({{convertDate(p.date)}}) </span>
        </span><br/>
        <span>{{kt("ChatGame")}}:</span>
        <input v-model="chatMessage">
        <button v-on:click="sendMessage()" > {{kt("Send message")}}  </button>
    </div>
  </div>

</template>

<script>


    import store from '../vuex/store'
    import {
        getEchoChoice,
        getEchoAction,
        getGTranslator,
        getKTranslator,
        getCurrentChoice,
        getGameState,
        translateGameElement,
        getGameId,
        getGameIsOver,
        getLocale,
        getHistory,
        getReactionList,
        getLastAction,
        getMenu,
        getMenuPiece,
        getPendingChoice,
		    getPendingPressKey,
        getPressKeyMessage,
        getChoices,
        getUserId,
        getChatMessages,
        getPlayerList
      } from '../vuex/getters'
    import * as actions from '../vuex/actions'

    // import Reaction from './Reaction.vue'

// to-do: if connection lost, go to games tab

export default {
  components: {
       // Reaction
  },
  data () {
     return {
       chatVisible: true
      }
  },
  created: function () {
    this.showEndOfText()
  },
  methods: {
      formatReaction: function (r) {

          var piece = this.t(r)
          if (piece == undefined) return ""

          return this.formatPiece (piece)
      },
      pressAnyKey: function () {
         store.dispatch('SET_KEY_PRESSED')
      },
      convertDate: function (dateJSON) {
          var d = new Date (JSON.parse (dateJSON))
          return d.toLocaleString()
      },
      formatPiece: function (piece) {

        // console.log ('Play.vue. piece: ' + JSON.stringify (piece))

        if (piece == undefined) return ""

          if (piece.type == "img") {

         	  if (piece.isLink) {
                   if (piece.isLocal)
	    	            return "<a href='" + require("./../../data/games/" + this.gameId + "/images/" + piece.src) + "' target='_blank'>" + piece.txt + "</a><br/>"
                   else
                        return "<a href='" + piece.src + "' target='_blank'>" + piece.txt + "</a><br/>"
              } else {
                   if (piece.isLocal)
                       return  "<p>" + piece.txt + "</p><img src='" + require("./../../data/games/" + this.gameId + "/images/" + piece.src) + "'/><br/>"
                   else
                       return  "<p>" + piece.txt + "</p><img src='" + piece.src + "'/><br/>" // to-do: in fact, it doesn't work
              }
          }

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
      actionToShow: function (choice, isEcho) {
          return this.echoAction (choice, isEcho)
      },
      choiceToShow: function (choice, isEcho) {
          return this.echoChoice (choice, isEcho)
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
      },
      seeChatSection() {
          this.chatVisible = !this.chatVisible
      },
      sendMessage() {
          // send message to server
          store.dispatch('SEND_CHAT_MESSAGE', this.chatMessage)
          this.chatMessage = ""
      }
  },
  store: store,
  vuex: {
    getters: {
       gameId: getGameId,
       gameIsOver: getGameIsOver,
       locale: getLocale,
       history: getHistory,
	     reactionList: getReactionList,
       lastAction: getLastAction,
       choices: getChoices,
       menu: getMenu,
       menuPiece: getMenuPiece,
       pendingChoice: getPendingChoice,
       pendingPressKey: getPendingPressKey,
	     pressKeyMessage: getPressKeyMessage,
       kt: getKTranslator,
       t: getGTranslator,
       tge: translateGameElement,
       currentChoice: getCurrentChoice,
       gameState: getGameState,
       echoChoice: getEchoChoice,
       echoAction: getEchoAction,
       userId: getUserId,
       chatMessages:getChatMessages,
       playerList:getPlayerList
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
  font: 200 Helvetica, Verdana, sans-serif;
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

  position: relative;
  top: 0;
  right: 0;
 	overflow: scroll;
  text-align: left;
	background-color:#FFF;
}

div.reactionList {
	background-color: #FFF;
  text-align: left;
}

div.play_bottom {
    position: relative;
    buttom: 0;
    right: 0;
}


div.mainChoices {
	background-color: #FFE;
}

div.chatSecton {
  background-color: #EEE;
  text-align: left;
  /*font-size: 0.9vw;*/
}

div.choices {
	background-color: #FFD;
  text-align: center;
}

button {
    border-radius: 5px;
    font-size: 1.5em;
}

div, p {
    font-size: 1em;
}

div.menuPiece {
  float:left;
}

@media screen  and (min-device-width: 1200px)  and (max-device-width: 1600px)  and (-webkit-min-device-pixel-ratio: 1),
        screen  and (min-device-width: 1200px)  and (max-device-width: 1600px)  and (-webkit-min-device-pixel-ratio: 2)  and (min-resolution: 192dpi) {
  button {
      font-size: 1em;
  }
}

@media screen and (min-resolution: 350dpi),
       screen and (min-resolution: 2dppx) {
  button {
      font-size: 1.3em;
  }
}




</style>
