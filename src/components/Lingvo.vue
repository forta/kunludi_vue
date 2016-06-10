<template>
  <div class="lingvo">
	<h2>{{kt("Language")}}: {{locale}}</h2>

	<h2>Your other languages:</h2>
    <ul>
        <li v-show="locale != 'en'"> 
            <button @click='setLocale("en")'>choose</button>
            en
            <button @click='removeAsFavouriteLanguage("en")'> remove </button>
        </li>
        <li v-show="locale != 'eo'"> 
            <button @click='setLocale("eo")'>choose</button>
            eo
            <button @click='removeAsFavouriteLanguage("eo")'> remove </button>
        </li>
    </ul>

	<h2>Other languages:</h2>
    <ul>
        <li>
            <button @click='setLocale("es")'>choose</button>
            es
            <button @click='addAsFavouriteLanguage("es")'> add </button>
        </li>
    </ul>

  </div>
</template>

<script>

import store from '../vuex/store'
import { getKTranslator, getLocale } from '../vuex/getters'
import * as actions from '../vuex/actions'

// import kunLingvo from './KunLingvo'

export default { 
   data () {
    return {
    }
  },
  methods: {
      
  },
  store: store,
  vuex: {
    getters: {
       locale: getLocale,
       kt: getKTranslator,
    },
    actions: actions
  }
}
</script>

<style scoped>

</style>
