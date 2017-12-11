<template>
  <div>

    <h3>Simple kunludi</h3>
    <div class="lang_off" v-if = "languageIndex<0">
      <!-- <h4>Language List: {{languageList | json}}</h4> -->
      <ul class="languageList">
          <li v-for="(index,l ) in languageList">
             <button v-on:click="loadLanguage(index)">/lang {{l}} </button>
          </li>
      </ul>
    </div>
    <div class="lang_on" v-if = "languageIndex>=0">
      <p>Language: {{languageList[languageIndex]}}</p>
      <div class="logon_off" v-if = "token<0">
        <button v-on:click="logon">/logon (hardcoded user and password by now)</button>
      </div>
        <div class="logon_on" v-if = "token.length>0">
        <p>Token: {{token}} <button v-on:click="logoff">/logoff</button> </p>

        <div class="gameId_off" v-if = "gameId.length==0">
          <div class="gamelist_off" v-if = "gameList.length==0">
            <button v-on:click="getGameList">/getGameList</button>
          </div>
          <div class="gamelist_on" v-if = "gameList.length>0">
            <li v-for="(index,g ) in gameList">
               <button v-on:click="loadGame(index)">/loadGame {{g.name}} </button>
            </li>
          </div>
        </div>

        <div class="gameId_on" v-if = "gameId.length>0">
          <p>Game: {{gameId}} </p>

          <div class="slotId_off" v-if = "slotId<0">
            <li v-for="(index,s ) in slotList">
               slotId: {{s.id}} Turns: {{s.gameTurn}} PlayerList: {{s.playerList | json}}
               <button v-on:click="joinLivegame(index)"> /joinLivegame {{s.id}}</button>
            </li>
          </div>

          <div class="slotId_on" v-if = "slotId>=0">
            <p>Slot: {{slotList[slotId].date}} Turns: {{slotList[slotId].gameTurn}} PlayerList: {{slotList[slotId].playerList | json}} </p>
            <p><b>gameState.gameTurn</b> {{gameState.gameTurn | json}} </p>
            <p><b>gameState.userState</b> {{gameState.userState| json}} </p>
            <p><b>gameState.reactionListCounter</b> {{gameState.reactionListCounter| json}} </p>

            <p><b>History</b></p>
            <li v-for="h in gameState.history">
               #{{h.gameTurn}} {{showAction (h.action)}} Reactions: {{{showReactionList (h.reactionList)}}}
            </li>


            <!-- <p><b>gameState.world</b> {{gameState.world| json}} </p> -->
            <!-- <p><b>gameState.devMessages</b> {{gameState.devMessages| json}} </p> -->
            <!-- <p><b>gameState.gameMessages</b> {{gameState.gameMessages| json}} </p> -->
            <!-- <p><b>gameState.gameExtraMessages</b> {{gameState.gameExtraMessages| json}} </p> -->

            <!-- <p><b>gameState.menu</b> {{gameState.menu| json}} </p> -->
            <div class="menun_on" v-if = "gameState.menu.length >0 ">
              <p><b>Menu:</b></p>
              <li v-for="(index,m ) in gameState.menu">
                 <b>{{translate("messages." + m.msg + ".txt")}}:</b>
                   <button v-on:click="chooseMenu(m.id)"> /chooseMenu {{m.id}}</button>
              </li>
            </div>

            <div class="keyPressed_on" v-if = "gameState.pendingPressKey ">
              <!-- <p><b>gameState.reactionListCountercurrentChoice</b> {{gameState.reactionListCountercurrentChoice | json}} </p> -->
              <p><b>gameState.pendingPressKey</b> {{gameState.pendingPressKey| json}} </p>
              <p><b>gameState.pressKeyMessage</b> {{gameState.pressKeyMessage| json}} </p>
            </div>

            <p><b>Choices:</b></p>
            <div class="choices_on" v-if = "gameState.menu.length == 0 && !gameState.pendingPressKey">
              <p><span v-for="(index,c ) in gameState.choices">
                <span v-if="c.isLeafe">
                  <button v-on:click="chooseAction(c)"> /chooseAction {{showChoice (c)}} </button>
                </span></span></p>
            </div>
          </div>

      </div>
    </div>
  </div>
</template>

<script>


export default {
  data () {

    return {
        languageIndex: -1,
        languageList: ["en", "es", "eo", "fr"], // llamada implícita al cargarse el módulo
        token: -1,
        gameList: [],
        gameId: "",
        slotList: [],
        slotId: -1,
        gameState: {}
    }
  },
  methods: {
      loadLanguage: function (index) {
        this.languageIndex=index
        /*
        POST http://localhost:8090/api/setLocale
        params = {token:this.token, locale: this.locale}
        */
      },
      logon: function () {

        var params = {"params":{"userId":"pakito","hash":"811c9dc5","locale":"es"}}

         this.$http.post('http://localhost:8090/api/logon',params).then(response => {
           this.token = response.body.token
         }, response => {
           alert ('not logged')
         });
      },
      logoff: function () {
        this.token = -1
        this.gameList= []
        this.gameId= ""

        /*
        POST url = 'http://localhost:8090/api/users/' + this.token + '/logoff'

        this.connectionState = -1 // initial state
        this.userId = ""
        this.chatMessagesSeq = this.gameTurn = 0
        this.playerListLogons = this.playerListLogoffs = 0

        */

      },
      getGameList: function (id, slotId, newLocal) {
        this.$http.get('http://localhost:8090/api/games/' + this.token).then(response => {
          this.gameList = response.body;
        }, response => {
          // error callback
          alert ("error!")
        });
      },
      loadGame: function (index) {
        this.$http.get('http://localhost:8090/api/gameSlotList/' + this.token + '/' + this.gameList[index].name).then(response => {
          this.gameId = this.gameList[index].name
          this.slotList = response.body.gameSlotList;
        }, response => {
          // error callback
          alert ("error!")
        });
      },
      joinLivegame: function (index) {

        var params = {"params":{"gameId":this.gameId,"token":this.token,"slotId":this.slotList[index].id}}

        this.$http.post('http://localhost:8090/api/joinlivegame', params).then(response => {
          this.slotId = index
          this.gameState = response.body
        }, response => {
          // error callback
          alert ("error!")
        });

      },
      chooseMenu: function (id) {
        alert ("Pending to implement!")
        /*
        var params = {"params":{"gameId":this.gameId,"token":this.token,"slotId":this.slotList[index].id}}

        this.$http.post('http://localhost:8090/api/joinlivegame', params).then(response => {
          this.slotId = index
          this.gameState = response.body
        }, response => {
          // error callback
          alert ("error!")
        });
        */

      },
      translate: function (msg) {

        // look for msg in this.gameState.gameMessages
        if (typeof this.gameState.gameMessages[msg] != "undefined") {
          return this.gameState.gameMessages[msg].message
        }

        var locale = this.languageList[this.languageIndex]
        if (this.gameState.devMessages[locale][i] != "") {
          return this.gameState.devMessages[locale][i]
        }

        return "[" + msg + "]"
      },
      showAction: function (action) {
        // return JSON.stringify (action)
        return action.action.actionId
      },
      showReaction: function (reaction) {
        // return JSON.stringify (reaction)
        if (reaction.type == "rt_msg") {
          return this.translate ("messages." + reaction.txt + ".txt")
        } else {
          return reaction.type
        }
      },
      showReactionList: function (reactionList) {
        var result = " => "
        for (var r in reactionList) {
           result += this.showReaction (reactionList[r])
        }
        return result
      },
      showChoice: function (choice) {
        // return JSON.stringify (choice)
        return choice.action.actionId
      }

  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

li,p {
  text-align: left;
}

</style>
