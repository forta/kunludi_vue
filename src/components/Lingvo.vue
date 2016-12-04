<template>

  <div class="lingvo">

  <br/><br/><br/>
  <h2> {{kt("Language")}}: {{locale}} </h2>

  <img src="./../../data/icons/languages.jpg">

	<h2>{{kt("Your languages")}}:</h2>
    <ul>
        <li v-for="l in languages.pref">
            <span v-if ="langIsValid (l)">
            <button @click='setLocale(l)'>{{kt("choose")}}</button>
            <span class="lingvoText"> {{l}} </span>
            <!-- <button @click='removeAsFavouriteLanguage("en")'> remove </button> -->
            </span>
        </li>

    </ul>

	<h2>{{kt("Additional languages")}}:</h2>
    <ul>
        <li v-for="l in languages.other">
            <span v-if ="langIsValid (l)">
                <button @click='setLocale(l)'>{{kt("choose")}}</button>
                <span class="lingvoText"> {{l}} </span>
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
  border-bottom: 1px solid #ccc;
  text-align: center;
}

li:last-child {
  border: none;
}

button {
    border-radius: 10px;
    font-size: 1em;
}

button:hover {
    background-color: #4CAF50; /* Green */
    border-radius: 10px;
    color: white;
}

.lingvoText {
  font-size: 1em;
}


</style>
