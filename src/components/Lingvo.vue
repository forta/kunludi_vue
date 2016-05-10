<template>
  <div class="lingvo">
	<h2>{{myi18n.Language.message}}: {{locale}}</h2>
	<p>userId: {{userId}}</p>
    <h3>Count is {{ counterValue }}</h3>
    <button @click='increment'>Increment +1</button>
    <button @click='incrementBy(3)'>Increment +3</button>

    <button v-show="locale != 'en'" @click='setLocale("en")'>en</button>
    <button v-show="locale != 'es'" @click='setLocale("es")'>es</button>
    <button v-show="locale != 'eo'" @click='setLocale("eo")'>eo</button>

    <ul>
            <li v-for="reaction in reactionList">
                <p> Ejemplo de traducción dinámica de frase del juego: {{reactionTranslation(reaction)}} </p>
            </li>
     </ul>

  </div>
</template>

<script>

import store from '../vuex/store'
import { geti18n, getGameMsg, getGameItem, getLocale, getCount, getUserId } from '../vuex/getters'
import * as actions from '../vuex/actions'

// import kunLingvo from './KunLingvo'

export default {  data () {
    return {
        reactionList: [
           {msg:'You have o1', o1:'book'}, 
           {msg:'You need o1', o1:'pencil'}
         ]
    }
  },
  methods: {
      reactionTranslation(reaction) {
          // to-do: this must be done outside of this module, using localization rules
          let expanded = this.gameMsg[reaction.msg].message
          
          if (this.locale == 'en' ) return expanded.replace ("o1", "a(n)" + this.itemTranslation(reaction.o1))
          else if (this.locale == 'es' ) return expanded.replace ("o1", "un(a)" + this.itemTranslation(reaction.o1))
          else if (this.locale == 'eo' ) return expanded.replace ("o1", this.itemTranslation(reaction.o1) +  "n")
          
          return expanded.replace ("o1", this.itemTranslation(reaction.o1))  
      },
      itemTranslation(itemId) {
          // return itemId
          return this.gameItem[itemId].message
      },
  },
  store: store,
  vuex: {
    getters: {
       counterValue: getCount,
       userId: getUserId,
       locale: getLocale,
       myi18n: geti18n,
       gameMsg: getGameMsg,
       gameItem: getGameItem
    },
    actions: actions
  }
}
</script>

<style scoped>

</style>
