<template>
  <div class="login">
	<div v-show="userId == ''">
  		
        <!-- <p>Please type your user name and password to logon: </p> -->
        <label> {{kt("Type your user name and push enter")}}: </label><input v-model="newUserId" v-on:keyup.enter="modifyUserId"><br/>
        <!--
  		<label>Password: </label> <input v-model="newUserId2">
        
        <br/>
         
  		<p>Or create a new aocout: </p>
  		<label>New user name: </label> <input v-model="newUserId2"><br/>
  		<label>Password: </label> <input v-model="newPwd"><br/>
  		<label>email: </label> <input v-model="newEmail">
        -->
        
	</div>
  </div>
</template>

<script>

import store from '../vuex/store'
import { getUserId, getKTranslator } from '../vuex/getters'
import * as actions from '../vuex/actions'

export default {
  data () {
    return {
      newUserId: ''
    }
  },
  created: function () {
    console.log('login created: this.$route.params: ' + JSON.stringify (this.$route.params))
  },
  ready: function () {
    console.log('login ready: this.$route.params: ' + JSON.stringify (this.$route.params))
  },
 
  methods: {
    modifyUserId: function () { 
		var text = this.newUserId.trim()
		  if (text) {
			this.newUserId = text
            store.dispatch('SETUSERID', text)
		  }
	}
  },
  route: {
    activate: function () {
        console.log('login route activated!')
        console.log('this.$route.path: ' + JSON.stringify (this.$route.path))
        console.log('this.$route.params: ' + JSON.stringify (this.$route.params))
        console.log('this.$route.query: ' + JSON.stringify (this.$route.query))
        
    }
  },
  store: store,
  vuex: {
    getters: {
       userId: getUserId,
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

.login {
  text-align: left;
}

</style>
