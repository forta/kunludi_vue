<template>
  <div class="about">

    <br/><br/><br/>
	  <!-- <h3>{{kt("About")}} </h3> -->
    <div v-show="locale == 'en'">

    <h4>Welcome to kunludi!</h4>
    <p>"kun-ludi" means "to play together" in Esperanto. This is a environment <u>under development</u> to play <b>multilingual adventures of interactive fiction </b>.</p>

    <p> Kunludi will later allow you to interact with other players: chat with them and see what they do in their games.</p>

    <p>The goal is to play <u>in team mode</u>, with two variants: in leader mode (leader decides and observers propose actions, including asking to be the new leader); Or in democratic mode (choosing the most popular option among those proposed by the players).</p>

    <p>If you want to collaborate in some way, you can write to: ludi.ludon (at) gmail (dot) com.</p>

    <h3>Instructions </h3>

    <p>1. Choose the language you want to use: Language </p>

    <p>2. Choose your game: Play / Games / Load initial game state</p>

    <p>3. Once the game is started, to save the current game status or to load a previously saved game: click on <b>File</b></p>


    <h3>Available games</h3>

    <ul>
    <li>&quot;The Three Sources&quot;, in an earlier version of kunludi, took part in the <a href="http://wiki.caad.es/XComp_3" target="_blank">XComp</a> in 2016 and was honored in the &quot;R &amp; D &quot; section.</li>
    <li>&quot;<a href="http://wiki.caad.com/VampireProject" target="_blank"> vampire </a>&quot; was originally written in Spanish but it has unpolished machine translations into English, Esperanto and French. </li>
    <li><a href="https://eo.wikipedia.org/wiki/Interreagema_fikcio" target="_blank">&quot;texel&quot;</a> was originally written in Esperanto using <a hred = " Https://eo.wikipedia.org/wiki/Aventuro_(tekstaventuro) "target =" _ blank ">another system</a>. It is still under development. </li>
    <li>&quot;My Dear Sister&quot; it is only in Spanish by the moment. It was featured in the &quot;<a href="http://wiki.caad.es/M%C3%A1s_all%C3%A1_de_la_Comp" target="_blank">Beyond-Death Comp</a>&quot; in 2017.</li>
    </ul>

    <h3>More</h3>
    <ul>
    <li>Blog: <a href="http://blog.kunludi.com" target="_blank">http://blog.kunludi.com</a></li>
    <li>Source code of kunludi: <a href="https://github.com/forta/kunludi_vue" target="_blank"> https://github.com/forta/kunludi_vue</a> (Two games included: Vampiro and My Dear Sister)</li>
    <li>Source code of game The Three Fountains: <a href="https://github.com/forta/kunludiGame_tresfuentes" target="_blank">https://github.com/forta/kunludiGame_tresfuentes</a></li>
    <li>Source code of game Texel: <a href="https://github.com/forta/kunludiGame_texel" target="_blank">https://github.com/forta/kunludiGame_texel</a></li>
    </ul>

    </div>

    <div v-show="locale == 'es'">

        <h4>¡Bienvenido a kunludi!</h4>

        <p>"kun-ludi" significa "jugar juntos" en esperanto. Se trata de un entorno <u>en desarrollo</u> para jugar <b>aventuras multilingües de ficción interactiva</b>.</p>

        <p>Kunludi permitirá más adelante interactuar con otros jugadores que jueguen a tu mismo juego, para charlar con ellos y ver qué hacen en sus partidas.</p>

        <p>El objetivo es poder jugar <u>en modo equipo</u>, con dos variantes: en modo líder (el líder decide y los observadores proponen acciones, incluyendo pedir ser el nuevo líder); o bien en modo democrático (eligiéndose la opción más popular entre las propuestas por los jugadores).</p>

        <p>Si quieres colaborar de alguna manera, nos puedes escribir a: ludi.ludon (arroba) gmail (punto) com .</p>

     	<h3>Instrucciones</h3>

        <p>1. Elige el idioma que quieres usar: Idioma</p>

        <p>2. Elige tu juego: Jugar / Juegos / Cargar estado inicial del juego</p>

        <p>3. Una vez iniciado el juego, para guardar el estado actual del juego o cargar una partida guardada previamente: pulsa en <b>Archivo</b></p>

     	<h3>Juegos disponibles</h3>
        <ul>
        <li>&quot;Las Tres Fuentes&quot;, en una versión anterior de kunludi, se presentó en la <a href="http://wiki.caad.es/XComp_3" target="_blank">XComp</a> de 2016 y fue permiada en la sección &quot;I+D&quot;. Con traducciones máquina sin pulir en inglés y esperanto.</li>
        <li>&quot;<a href="http://wiki.caad.es/Proyecto_Vampiro" target="_blank">vampiro</a>&quot; fue escrito originalmente en español. Con traducción avanzada al francés y traducciones máquina sin pulir a inglés y esperanto.</li>
        <li><a href="https://eo.wikipedia.org/wiki/Interreagema_fikcio" target="_blank">&quot;texel&quot;</a> fue escrito originalmente en esperanto usando <a href ="https://eo.wikipedia.org/wiki/Aventuro_(tekstaventuro)"  target="_blank">un sistema de desarrollo en MSDOS de su autor</a>. Conversión a kunludi aún en desarrollo.</li>
        <li>&quot;Mi Querida Hermana&quot; por ahora sólo se encuentra en español. Se presentó en la &quot;<a href="http://wiki.caad.es/M%C3%A1s_all%C3%A1_de_la_Comp" target="_blank">Más allá de la Comp</a>&quot; de 2017.</li>
        </ul>

     	<h3>Más</h3>
        <ul>
        <li>Blog: <a href="http://blog.kunludi.com" target="_blank">http://blog.kunludi.com</a></li>
        <li>Código fuente de kunludi: <a href="https://github.com/forta/kunludi_vue" target="_blank"> https://github.com/forta/kunludi_vue</a> (Incluye dos juegos: Vampiro y Mi Querida Hermana)</li>
        <li>Código fuente del juego Las Tres Fuentes: <a href="https://github.com/forta/kunludiGame_tresfuentes" target="_blank">https://github.com/forta/kunludiGame_tresfuentes</a></li>
        <li>Código fuente del juego Texel: <a href="https://github.com/forta/kunludiGame_texel" target="_blank">https://github.com/forta/kunludiGame_texel</a></li>
        </ul>
    </div>

    <div v-show="locale == 'eo'">



        <h4>Estu bonvena en kunludi!</h4>
        <p>Kompreneble, estas esperanta vorto kaj temas pri <u>evoluigata sistema</u> por ludi <b>plurlingvajn interaga-fikciajn aventurojn</b>.</p>

        <p>Kunludi eblos interagi kun aliaj sam-aventuraj ludantoj: babili kaj scii kion ili provas.</p>

        <p>La celo estas ludi <b>teame</b> per du variantoj: varianto gvidanta (la ĉefo decidas kaj observantoj proponas agojn, inkluzive peti esti la novan ĉefon); aŭ varianto demokratia (elektiĝos la plej populara elekto inter tiuj proponitaj de la ludantoj).

        <p>Se vi volas kunlabori iel ajn, vi povas kontakti nin je. ludi.ludon (ĉe) gmail (punkto) com .</p>

        <h3> Instrukcioj </h3>

        <p>1. Elektu viajn preferatan lingvon: Lingvo</p>

        <p>2. Elektu vian ludon: Ludi / Ludoj / Rekuperi startan statuson el ludo</p>

        <p>3. Post starti la ludon, por gardi la nunan lud-statuson aŭ ŝarĝi malnovan statuson, kliku sur <b>Arĥivo</b></p>

     	<h3>Haveblaj ludoj</h3>
        <ul>
        <li>&quot;La Tri Fontoj&quot;, en antaŭ versio prezentiĝis en hispana konkurso <a href="http://wiki.caad.es/XComp_3" target="_blank">XComp</a> de 2016 kaj gajnis en la sekcio &quot;E+D (esploro kaj disvolviĝo)&quot;. Tradukoj en la angla kaj esperanto, sed ankoraŭ ne polurigitaj.</li>
        <li>&quot;<a href="http://wiki.caad.es/Proyecto_Vampiro" target="_blank">vampiro</a>&quot; estis verkita originale en la hispana sed haveblas en nepolurigitaj aŭtomataj tradukoj en esperanto, franca kaj angla.</li>
        <li><a href="https://eo.wikipedia.org/wiki/Interreagema_fikcio" target="_blank">&quot;texel&quot;</a> estis verkita originale en esperanto. Ankoraŭ ne estas preta.</li>
        <li>&quot;Mia Kara Fratino&quot;, ankoraŭ nur en la hispana. Ĝi prezentiĝis en hispana konkurso &quot;<a href="http://wiki.caad.es/M%C3%A1s_all%C3%A1_de_la_Comp" target="_blank">Más allá de la Comp</a>&quot; en 2017.</li>
        </ul>

        <h3>Plu</h3>
        <ul>
        <li>Blogo: <a href="http://blog.kunludi.com" target="_blank">http://blog.kunludi.com</a></li>
        <li>Kodo de kunludi: <a href="https://github.com/forta/kunludi_vue" target="_blank"> https://github.com/forta/kunludi_vue</a> (Du ludoj inkluzivitaj: Vampiro kaj Mia Kara Fratino)</li>
        <li>Kodo de la ludo La Tri Fontoj: <a href="https://github.com/forta/kunludiGame_tresfuentes" target="_blank">https://github.com/forta/kunludiGame_tresfuentes</a></li>
        <li>Kodo de la ludo Texel: <a href="https://github.com/forta/kunludiGame_texel" target="_blank">https://github.com/forta/kunludiGame_texel</a></li>
        </ul>

    </div>

    <div v-show="locale == 'fr'">
        <h4>Bienvenue à kunludi!</h4>
        <p>"kun-ludi" signifie «jouer ensemble» en espéranto. Il est un environnement <u>en développement</u> pour jouer <b>multilingue aventure fiction interactive </b>.</p>

        <p>Kunludi à l'avenir permettra interagir avec d'autres joueurs qui jouent votre propre jeu: bavarder avec eux et voir ce qu'ils font dans leurs jeux.</p>

        <p>Le but est de jouer en <u>équipe</u>, avec deux variantes: mode chef (le chef décide et observateurs a proposé des actions, y compris en demandant à être le nouveau chef); ou de manière démocratique (selon ce qui est le choix le plus populaire parmi ceux proposés par les joueurs).</p>

        <p>Si vous voulez aider en quelque sorte, nous pouvons écrire: ludi.ludon (at) gmail (dot) com</p>.

        <h3>Instructions</h3>

        <p> 1. Choisissez la langue que vous souhaitez utiliser: Langue </p>

        <P> 2. Choisissez votre jeu: Jouer / Jeux / Chargez état initial du jeu </ p>

        <p>3. Une fois le jeu lancé, pour sauvegarder l'état actuel du jeu ou pour charger un jeu précédemment enregistré: cliquez sur <b>Archive</b></p>


     	<h3>Jeux disponibles (à traduire)</h3>
        <ul>
        <li>&quot;Las Tres Fuentes&quot;, en una versión anterior de kunludi, se presentó en la <a href="http://wiki.caad.es/XComp_3" target="_blank">XComp</a> de 2016 y fue permiada en la sección &quot;I+D&quot;.</li>
        <li>&quot;<a href="http://wiki.caad.es/Proyecto_Vampiro" target="_blank">vampiro</a>&quot; fue escrito originalmente en español pero tiene traducciones máquina sin pulir a inglés, esperanto y francés.</li>
        <li><a href="https://eo.wikipedia.org/wiki/Interreagema_fikcio" target="_blank">&quot;texel&quot;</a> fue escrito originalmente en esperanto y en otro sistema. Está aún en desarrollo.</li>
        <li>&quot;Mi Querida Hermana&quot; por ahora sólo se encuentra en español. Se presentó en la &quot;<a href="http://wiki.caad.es/M%C3%A1s_all%C3%A1_de_la_Comp" target="_blank">Más allá de la Comp</a>&quot; de 2017.</li>
        </ul>

     	<h3>Plus</h3>
        <ul>
        <li>Blog: <a href="http://blog.kunludi.com" target="_blank">http://blog.kunludi.com</a></li>
        <li>Code source de kunludi: <a href="https://github.com/forta/kunludi_vue" target="_blank"> https://github.com/forta/kunludi_vue</a> (Y compris les jeux: Vampiro et Ma Chère sœur</li>
        <li>Code source du jeu juego Las Tres Fuentes: <a href="https://github.com/forta/kunludiGame_tresfuentes" target="_blank">https://github.com/forta/kunludiGame_tresfuentes</a></li>
        <li>Code source du jeu Texel: <a href="https://github.com/forta/kunludiGame_texel" target="_blank">https://github.com/forta/kunludiGame_texel</a></li>
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
