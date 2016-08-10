<template>
  <h2> <a v-link="{ path: '/kune' }"> {{kt("Together")}} | </a>
  <a v-link="{ path: '/ludi' }"> {{kt("Play")}} | </a>
  {{kt("Language")}}: {{locale}}</h2>

  <div class="lingvo">

  <img src="./../../data/icons/languages.jpg">

	<h2>{{kt("Your languages")}}:</h2>
    <ul>
        <li v-for="l in languages.pref">
            <span v-if ="langIsValid (l)"> 
            <button @click='setLocale(l)'>{{kt("choose")}}</button>
            {{l}} 
            <!-- <button @click='removeAsFavouriteLanguage("en")'> remove </button> -->
            </span>
        </li>
        
    </ul>

	<h2>{{kt("Additional languages")}}:</h2>
    <ul>
        <li v-for="l in languages.other">
            <span v-if ="langIsValid (l)"> 
                <button @click='setLocale(l)'>{{kt("choose")}}</button>
                {{l}} 
                <!-- <button @click='removeAsFavouriteLanguage("en")'> remove </button> -->
            </span>
        </li>
    </ul>
    

  </div>
</template>

<script>

import store from '../vuex/store'
import { getKTranslator, getLocale, getLanguages} from '../vuex/getters'
import * as actions from '../vuex/actions'

// import kunLingvo from './KunLingvo'

export default { 
   data () {
    return {
    }
  },
  methods: {
     langIsValid: function (lang) {
         if (this.languages.inGame == undefined) return true
         for (var l=0; l<this.languages.inGame.length;l++ ) {
             if (this.languages.inGame.indexOf (lang) >= 0) return true
         }
         return false
     }
  },
  store: store,
  vuex: {
    getters: {
       locale: getLocale,
       languages: getLanguages,
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
