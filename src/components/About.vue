<template>
  <div class="about">
	<h3>{{kt("About")}} | </h3>
    
    <div v-show="locale == 'en'">

        <h4>     Welcome to LUDI!     </h4>  
        <p>LUDI means to play in Esperanto, games in Latin and people in Russian... so it's an under-construction environment to play multilingual interactive fiction games in a tiny collaborative network.</p>  
        <p>You can contact us (mail: ludi.ludon at gmail.com). if you want to collaborate somehow.</p>  

        <p>With LUDI you will be able to play offline or login to interact with another players. You will also be able to share your game actions and see what the other people do in the game.</p>  

        <h3>  Instructions  </h3>

        <p>Modify your preferred languages: Profile / Set your language preferences / Apply changes</p>

        <p>Choose your game: Games / Stable games / tresfuentes / Load game from start / add or remove languages / Apply changes</p>

        <p>Online interaction with another players: Profile / Set nick name / write your nick name and push intro</p>		
        <p>When you log on with a nick name you can send public or private messages to the other players, share your actions with them and see their actions. You can read and write messages on boards as well. At any moment, you can log out from the server.</p>

        <p>Playability</p>
        <ul>
        <li>For two-item actions, you must first mark the second item, generally a container or a character.</li>
        <li>For instance, to put X into Y: first mark Y and when you click on X, you\'ll be able to choose \'put into\'</li>
        <li>Similarly, to use X on Y: first mark Y and when you click on X, you\'ll be able to choose \'use on\'</li>
        <li>When you choose to talk to a character, a list of senteces will be shown. You\'ll have to choose one of them.</li>
        </ul>		
    
    </div> 

    <div v-show="locale == 'es'">
    
        <h4>     ¡Bienvenido a LUDI!     </h4>  
        <p>LUDI significa jugar en esperanto, juegos en latín y gente en ruso... se trata de un entorno en desarrollo para jugar aventuras  multilingües de ficción interactiva en una pequeña red colaborativa.</p>  
        <p>Nos puedes escribir (mail: ludi.ludon at gmail.com) si quieres colaborar de alguna manera.</p>  

        <p>LUDI permitirá jugar de manera aislada o bien conectarte e interactuar con otros jugadores. También podrás hacer público qué acciones realizas en el juego y ver qué hacen los otros jugadores.</p>  

     	<h3> Instrucciones </h3>

        <p>Modifica tus idiomas preferidos: Perfil / Elige tus idiomas preferidos / Aplica cambios</p>

        <p>Elige tu juego: Juegos / Juegos estables / tresfuentes / Carga juego desde cero</p>

        <p>Para interactuar con otros jugadores: Perfil / Ponte un apodo / escribir tu apodo y aceptar.</p>
        <p>Cuando se inicia sesión con un apodo se puede enviar mensajes públicos o privados a los otros jugadores, compartir tus acciones con ellos y ver sus acciones. También podrás leer y escribir mensajes en los foros. En cualquier momento, puedes cerrar la sesión con el servidor.</p>

        <p>Jugabilidad</p>
        <ul>
        <li>Para acciones con dos objetos, hay que marcar uno de ellos, generalmente un contenedor o un personaje.</li>
        <li>Por ejemplo, para meter X en Y: primero se marca Y y luego al pulsar en X aparecerá disponible la acción 'meter dentro de'.</li>
        <li>De igual manera, para usar X en Y: primero se marca Y y luego al pulsar en X aparecerá disponible la acción 'usar en'.</li>
        <li>Al seleccionar la acción hablar con un personaje aparecerá una lista de frases entre las que elegir.</li>
        </ul>			

    </div> 

    <div v-show="locale == 'eo'">
    


        <h4>     Estu bonvena en LUDI!     </h4>  
        <p>LUDI signifas ludi en Esperanto, ludoj en la latina kaj personoj en la rusa ... do temas pri konstruanta medio por ludi plurlingvajn interaga-fikciajn ludojn en eta kunlabora reto.</p>  

        <p>Vi povas kontakti nin (mail: ludi.ludon at gmail.com) se vi volas kunlabori iel ajn.</p>  

        <p>Per LUDI vi povos ludi izole aŭ ensaluti por interagi kun alia ludantoj. Vi ankaŭ povos dividi vian ludajn agojn kaj vidi kion faras la aliaj ludantoj en la ludo.</p>  

        <h3> Instrukcioj </h3>

        <p>Elektu viajn preferatajn lingvojn: Profilo / Elektu viajn preferatajn lingvojn / Efektivigu ŝanĝojn </p>

        <p>Elektu vian ludo: Ludoj / Stabilaj ludoj / tresfuentes / Rekuperi ludon ekde nulo </p>

        <p>Por interagado kun alia ludantoj: Profilo / Elektu vian komnomon / skribu vian komnomon kaj konfirmu.</p>
        <p>Kiam vi ensalutas kun komnomo vi povas sendi publikajn aŭ privatajn mesaĝojn al la aliaj ludantoj, havebligi viajn agojn kun ili kaj vidi iliajn agojn. Vi ankaŭ povos legi kaj skribi mesaĝojn en forumoj. Ĉiumomente, vi povos elsaluti el la servilo. </p>

        <p>Ludeco</p>
        <ul>
        <li>Por agoj kun du objektoj, vi devas unue marki la duan objekton, ĝenerale ujo aŭ gravulo.</li>
        <li>Ekzemple, por meti X en Y: unue marku Y-on kaj kiam vi klaku sur X, vi povos elekti \'enmeti en\'</li>
        <li>Simile, uzi X sur Y: unue marku Y-on kaj kiam vi klaku sur X, vi povos elekti 'uzi sur'.</li>
        <li>Kiam vi elektas paroli al iu karaktero, estos montrita listo de eblecoj. Vi devos elekti unu el ili.</li>
        </ul>		



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
