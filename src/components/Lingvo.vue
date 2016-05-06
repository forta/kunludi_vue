<template>
  <div class="lingvo">
	<p>Language: {{langId}}</p>
	<p>userId: {{userId}}</p>
    <h3>Count is {{ counterValue }}</h3>
    <button @click='increment'>Increment +1</button>
    <button @click='incrementBy(3)'>Increment +3</button>
  </div>
</template>

<script>

import store from '../vuex/store'
import {  getCount, getUserId } from '../vuex/getters'
import * as actions from '../vuex/actions'

// import kunLingvo from './KunLingvo'

export default {
  data () {
    return {
	  langId: 'EN'
    }
  },
  store: store,
  vuex: {
    getters: {
       counterValue: getCount,
       userId: getUserId
    },
    actions: actions
  }
}
</script>

<style scoped>

</style>
