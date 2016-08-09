<template>
  <div class="about">
	<h3>{{kt("About")}} | </h3>
    
    <div v-show="locale == 'en'">

        <h4>Welcome to LUDI!</h4>  
        <p>LUDI means to play in Esperanto, games in Latin and people in Russian... so it's an under-construction environment to play multilingual interactive fiction games in a tiny collaborative network.</p>  
        <p>You can contact us (mail: ludi.ludon at gmail.com). if you want to collaborate somehow.</p>  

        <p>With LUDI you will be able to play offline or login to interact with another players. You will also be able to share your game actions and see what the other people do in the game.</p>  

        <h3>Instructions</h3>

        <p>1. Choose your preferred language .</p>

        <p>2. Choose your game</p>
        
        <p><b>Note: </b>The games "tres fuentes" and <a href="http://wiki.caad.es/Proyecto_Vampiro" target="_blank">&quot;vampiro&quot;</a> were originally written in Spanish with rude machine traslation into English and Esperanto; the game <a href="https://eo.wikipedia.org/wiki/Interreagema_fikcio" target="_blank">&quot;texel&quot;</a> was originally written in Esperanto but it is under development.</p>

        </ul>		
    
    </div> 

    <div v-show="locale == 'es'">
    
        <h4>¡Bienvenido a kun-ludi!</h4> 
         
        <p>"ludi" significa jugar en esperanto, juegos en latín y gente en ruso... se trata de un entorno en desarrollo para jugar aventuras  multilingües de ficción interactiva en una pequeña red colaborativa.</p>  
        <p>Nos puedes escribir (mail: ludi.ludon at gmail.com) si quieres colaborar de alguna manera.</p>  

        <p>LUDI permitirá jugar de manera aislada o bien conectarte e interactuar con otros jugadores. También podrás hacer público qué acciones realizas en el juego y ver qué hacen los otros jugadores.</p>  

     	<h3>Instrucciones</h3>

        <p>1. Elige el idioma que quieres usar</p>
        
        <p>2. Elige tu juego</p>
        
        <p><b>Nota: </b>Los juegos "tres fuentes" y <a href="http://wiki.caad.es/Proyecto_Vampiro" target="_blank">&quot;vampiro&quot;</a> fueron escritos originalmente en español pero tienen traducciones máquina sin pulir a inglés y esperanto; el juego <a href="https://eo.wikipedia.org/wiki/Interreagema_fikcio" target="_blank">&quot;texel&quot;</a> fue escrito originalmente en esperanto y aún está en desarrollo.</p>


    </div> 

    <div v-show="locale == 'eo'">
    


        <h4>     Estu bonvena en LUDI!     </h4>  
        <p>LUDI signifas ludi en Esperanto, ludoj en la latina kaj personoj en la rusa ... do temas pri konstruanta medio por ludi plurlingvajn interaga-fikciajn ludojn en eta kunlabora reto.</p>  

        <p>Vi povas kontakti nin (mail: ludi.ludon at gmail.com) se vi volas kunlabori iel ajn.</p>  

        <p>Per LUDI vi povos ludi izole aŭ ensaluti por interagi kun alia ludantoj. Vi ankaŭ povos dividi vian ludajn agojn kaj vidi kion faras la aliaj ludantoj en la ludo.</p>  

        <h3> Instrukcioj </h3>

        <p>1. Elektu viajn preferatan lingvon</p>

        <p>2. Elektu vian ludon.</p>

        <p><b>Rimarko: </b>La ludoj  "tres fuentes" kaj <a href="http://wiki.caad.es/Proyecto_Vampiro" target="_blank">&quot;vampiro&quot;</a> estis origine verkitaj en la hispana sed kun aŭtomataj tradukoj en la angla kaj esperanto; la ludo <a href="https://eo.wikipedia.org/wiki/Interreagema_fikcio" target="_blank">&quot;texel&quot;</a> estis verkita en esperanto per <a hred ="https://eo.wikipedia.org/wiki/Aventuro_(tekstaventuro)"  target="_blank">alia sistemo</a> sed ankoraŭ ne estis portita al LUDI.</p>

    </div> 
    
  </div>
</template>

<script>

import store from '../vuex/store'
import {getKTranslator, getLocale } from '../vuex/getters'
import * as actions from '../vuex/actions'

export default {
  data () {
    return {
      newUserId: ''
    }
  },
 
  methods: {
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
       locale: getLocale,
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
