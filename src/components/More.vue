<template>
  <div class="about">
	<h3>{{kt("Details")}} {{gameId}} </h3>
    
    <ul>
        <li> <b>{{kt("Title")}}:</b> {{about.translation[languageIndex].title}} </li>
        <li> <b>{{kt("Description")}}:</b> {{about.translation[languageIndex].desc}} </li>
        <li> <b>{{kt("Introduction")}}:</b> {{about.translation[languageIndex].introduction}} </li>
        <li> <b>{{kt("Author")}}:</b> {{about.translation[languageIndex].author.name}} 
                (<b>{{kt("ludi account")}}:</b> {{about.translation[languageIndex].author.ludi_account}})
            (<b>{{kt("email")}}:</b> {{about.translation[languageIndex].author.email}})</li>
     </ul>

  </div>
</template>

<script>

import store from '../vuex/store'
import {getKTranslator, getLocale, getGameAbout, getGameId } from '../vuex/getters'
import * as actions from '../vuex/actions'

export default {
  data () {
    return {
        languageIndex:0
    }
  },
  ready: function () {
      if (this.about.translation == undefined) return
      var languageIndex = 0
      for (var l=0; l<this.about.translation.length;l++) if (this.about.translation[l].language == this.locale) languageIndex = l
      this.languageIndex = languageIndex
  },
  
  methods: {
      
  },
  route: {
    activate: function () {
        
    }
  },
  store: store,
  vuex: {
    getters: {
       locale: getLocale,
       about: getGameAbout,
       gameId: getGameId,
       kt: getKTranslator
    },
    actions: actions
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

p, li {
    text-align: left;
}

h1 {
  color: #42b983;
}

.login {
  text-align: left;
}

</style>
