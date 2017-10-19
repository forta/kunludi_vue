<template>


  <div class="ludi_top1">
    <h2>

    <a v-link="{ path: '/kune' }"> {{kt("Together")}} </a> |

    <span v-show="!gameId"> <a v-show="!gameId" v-link="{ path: '/ludi/games' }"> {{kt("Games")}} </a> | </span>
    <span v-show="gameId">  <a  v-link="{ path: '/ludi/play' }"> {{kt("Play")}} </a> | </span>
    <a v-link="{ path: '/ludi/lingvo' }"> {{kt("Language")}} </a>
    | <a v-link="{ path: '/ludi/about' }"> {{kt("About")}}  </a>

    <span v-show="gameId"> | <a v-link="{ path: '/ludi/files' }"> {{kt("Files")}} </a>  </span>

    </h2>

  </div>

  <br/><br/><br/>

  <h2> {{kt("Under construction")}}</h2>
  <p> {{{kt("Kune introduction")}}} </p>

  <img src="./../../data/icons/social.jpg">

  <div class="kune">
	<div v-show="userId != ''">
        <h3>{{kt("Username")}}: {{ userId }}</h3>
        <p v-if="userId=='admin'"> <a v-link="{ path: '/admin' }"> {{kt("Admin")}} </a> </p>
        <button v-on:click="logout">Logout</button>
        <!--
        <a v-show="userId != 'annonymous'"  v-link="{ path: '/kune/messages' }"> {{kt("Messages")}} | </a>
        <a v-show="userId != 'annonymous'"  v-link="{ path: '/kune/boards' }"> {{kt("Boards")}} | </a>
        -->
	</div>
    <router-view></router-view>
  </div>

  <div class="chatSecton" v-show="userId != ''">
    <b>{{kt("Online Players")}}: </b>
    <span v-for="p in playerList">
        <span><b>{{p.userId}}</b>({{convertDate(p.date)}}) | </span>
    </span>

    <br/><br/>

    <!-- send private messages -->
    <!--
    <span>{{kt("ChatPrivate")}}. </span>
    <span>{{kt("Username")}}: </span>
    <input v-model="chatToUser">
    <input v-model="chatMessagePrivate">
    <button v-on:click="sendMessagePrivate()" > {{kt("Send message")}}  </button>
    -->

    </div>
  </div>

</template>
<script>

import store from '../vuex/store'
import { getUserId, getGameId, getKTranslator, getPlayerList } from '../vuex/getters'
import * as actions from '../vuex/actions'

export default {
  data () {
    return {
    }
  },
  methods: {
    logout: function () {
        store.dispatch('RESETUSERID')
        this.$router.go('/ludi')
   	},
    convertDate: function (dateJSON) {
        var d = new Date (JSON.parse (dateJSON))
        return d.toLocaleString()
    }
  },
  store: store,
  vuex: {
    getters: {
        kt: getKTranslator,
        userId: getUserId,
        gameId: getGameId,
        playerList: getPlayerList
    },
    actions: actions
  }
}
</script>


<style scoped>

</style>
