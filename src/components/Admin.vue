<template>

  <h2> Admin </h2>

  <div v-if = "!connected">
    <button v-on:click="connectAsAdmin()"> Connect  </button>
  </div>

  <div class="admin" v-if = "connected">
    <button v-on:click="setQueryLog ('logon')">Logons</button>
    <button v-on:click="setQueryLog ('logoff')">Logoffs</button>
    <button v-on:click="setQueryLog ('loadgame')">Loaded games</button>
    <button v-on:click="setQueryLog ('setlocale')">Locales</button>
    <button v-on:click="setQueryLog ('chat')">Chats</button>

    <h3>{{logType}}</h3>

    <ul class="resultList">
        <li v-for="r in result.data">
          <b>{{r.userId}}</b>
          <span v-if = "r.data.locale"> locale:{{r.data.locale}}</span>
          <span v-if = "r.data.gameId"> gameId:{{r.data.gameId}}</span>
          <span v-if = "r.data.reason"> reason:{{r.data.reason}}</span>
          <span v-if = "r.data.target"> target:{{r.data.target}}</span>
          {{r.timestamp}}(GMT)
        </li>
    </ul>

  </div>


</template>
<script>

import storeAdmin from '../vuex/admin/storeAdmin'
import { getConnected, getResult} from '../vuex/admin/gettersAdmin'
import * as actionsAdmin from '../vuex/admin/actionsAdmin'

export default {
  data () {
    return {
      logType:""
    }
  },
  methods: {
    connectAsAdmin: function () {
      storeAdmin.dispatch('CONNECT', 'admin', 'clave')
    },
    setQueryLog: function (logType) {
      this.logType = logType
      storeAdmin.dispatch('QUERY_LOGS', logType)
    }
  },
  store: storeAdmin,
  vuex: {
    getters: {
        connected: getConnected,
        result: getResult
    },
    actions: actionsAdmin
  }
}
</script>


<style scoped>

</style>
