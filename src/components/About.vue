<template>
  <div class="about">

    <br/><br/><br/>
	  <!-- <h3>{{kt("About")}} </h3> -->
    <div v-show="locale == 'en'">

    <h4>Welcome to kunludi!</h4>

    <p>&quot;kun-ludi&quot; means &quot;to play together&quot; in Esperanto. This is an environment to play <b> multi-lingual interactive fiction</b> games, with the option of playing in <u>cooperative mode</u>.</p>

	  <p>In order to play in collaborative mode, indicate your username in the &quot;Together&quot; tab and you will be able to play the game you choose with other players, and chat with them. In addition, if the chosen game is multilingual, several players may be watching the same game, each one in their own language.</p>

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
    <li>&quot;My Dear Sister&quot;originally written in Spanish but it has unpolished machine translations into English and Esperanto.  It was featured in the &quot;<a href="http://wiki.caad.es/M%C3%A1s_all%C3%A1_de_la_Comp" target="_blank">Beyond-Death Comp</a>&quot; in 2017.</li>
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

        <p>&quot;kun-ludi&quot; significa &quot;jugar juntos&quot; en esperanto. Se trata de un entorno para jugar <b>aventuras multilingües de ficción interactiva</b>, con la opción de jugar en <u>modo cooperativo</u>.</p>

        <p>Para jugar en modo colaborativo, indica tu nombre de usuario en la pestaña &quot;Juntos&quot; y podrás jugar al juego que elijas con otros jugadores, pudiendo chatear con ellos. Además, si el juego elegido es multilingüe, varios jugadores podrán estar viendo el mismo juego, cada uno en su idioma.</p>

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
        <li>&quot;Mi Querida Hermana&quot; escrita en español y con traducciones máquina a inglés y esperanto. Se presentó en la &quot;<a href="http://wiki.caad.es/M%C3%A1s_all%C3%A1_de_la_Comp" target="_blank">Más allá de la Comp</a>&quot; de 2017.</li>
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

        <p>Kompreneble, &quot;kun-ludi &quot; estas esperanta vorto kaj estas medio por ludi <b>multlingvajn interagajn fikciajn ludojn</b>, kun la eblo de ludi <u>kunlabore</u></p>

		    <p>Por ludi kunlabore, indiku vian uzantnomon en la langeto &quot;Kune&quot;  kaj vi povos ludi la ludon kiun vi elektos kun aliaj ludantoj kaj babili kun ili. Krome, se la elektita ludo estas multlingva, pluraj ludantoj povos vidi la saman ludon, ĉiu en sia propra lingvo.</p>

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
        <li>&quot;Mia Kara Fratino&quot;, verkita en la hispana sed kun nepolurigitaj aŭtomataj tradukoj en esperanto kaj angla. Ĝi prezentiĝis en hispana konkurso &quot;<a href="http://wiki.caad.es/M%C3%A1s_all%C3%A1_de_la_Comp" target="_blank">Más allá de la Comp</a>&quot; en 2017.</li>
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

        <p>&quot;kun-ludi&quot; signifie &quot;jouer ensemble&quot; en espéranto. C'est un environnement pour jouer à des <b>jeux de fiction interactifs multilingues</b>, avec la possibilité de jouer en <u>mode coopératif </u>.</p>

		    <p>Pour jouer en mode collaboratif, indiquez votre nom d'utilisateur dans le champ &quot;Ensemble&quot;. onglet et vous serez en mesure de jouer le jeu que vous choisissez avec d'autres joueurs, et discuter avec eux. De plus, si le jeu choisi est multilingue, plusieurs joueurs peuvent regarder le même jeu, chacun dans leur propre langue.</p>

        <p>Si vous voulez aider en quelque sorte, nous pouvons écrire: ludi.ludon (at) gmail (dot) com</p>.

        <h3>Instructions</h3>

        <p> 1. Choisissez la langue que vous souhaitez utiliser: Langue </p>

        <P> 2. Choisissez votre jeu: Jouer / Jeux / Chargez état initial du jeu </ p>

        <p>3. Une fois le jeu lancé, pour sauvegarder l'état actuel du jeu ou pour charger un jeu précédemment enregistré: cliquez sur <b>Archive</b></p>

     	<h3>Jeux disponibles</h3>

        <ul>
		<li>&quot;Trois Sources&quot;, dans une version antérieure de kunludi, a été présenté à la <a target="_blank" href ="http://wiki.caad.es/XComp_3">XComp  2016</a> et était reçu le premi sur le &quot;R & D&quot;. Avec traduction automatique grosse en anglais et l'espéranto.</li>
		<li>&quot;<a target="_blank" href = "http://wiki.caad.es/Proyecto_Vampiro"> vampire </a>&quot;. Il a été écrit en espagnol. Avec la traduction de pointe dans des traductions automatiques français et frustes en anglais et en espéranto.</li>
		<li><a target="_blank" href = "https://eo.wikipedia.org/wiki/Interreagema_fikcio">&quot; texel &quot;</a> a été écrit en espéranto en utilisant <a target =" _ blank " href = "https: / /eo.wikipedia.org/wiki/Aventuro_(tekstaventuro)"> un système de développement en MSDOS de l'auteur</a>. Conversion à kunludi encore en développement. </li>
		<li>&quot;My Dear Sister&quot; Écrite en espagnol, dans les traductions de la machine en anglaise et l'espéranto. Il a été présenté à la &quot; <a target="_blank" href ="http://wiki.caad.es/M%C3%A1s_all%C3%A1_de_la_Comp"> Beyond Comp &quot; 2016.</a></li>
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
