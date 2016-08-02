<template>
  <h2> <a v-link="{ path: '/kune' }"> {{kt("Together")}} | </a>
  <a v-link="{ path: '/ludi' }"> {{kt("Play")}} | </a>
  {{kt("Language")}}</h2>

  <div class="lingvo">

	<h2>{{kt("Your other languages")}}:</h2>
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

	<h2>{{kt("Other languages")}}:</h2>
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
 

</style>
