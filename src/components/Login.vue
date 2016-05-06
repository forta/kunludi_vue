<template>
  <div class="login">
    <button @click='increment'>Increment +1</button>
    <p>External user name: {{userId}}</p>

	<div v-show="userId == 'annonymous'">
  		<label>Please type your user name and press enter: </label>
        <input v-model="newUserId" v-on:keyup.enter="modifyUserId">
	</div>
	<div v-else>
        <p>Internal user name: {{newUserId}}</p>
	</div>
  </div>
</template>

<script>

import store from '../vuex/store'
import { getUserId } from '../vuex/getters'
import * as actions from '../vuex/actions'

export default {
  data () {
    return {
      newUserId: 'annonymous'
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
            store.dispatch('INCREMENT')
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
       userId: getUserId
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
</style>
