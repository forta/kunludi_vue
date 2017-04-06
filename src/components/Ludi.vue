<template>
    <div class="ludi" id="ludi">

        <div class="ludi_top1">

            <h2>

			      <a v-link="{ path: '/kune' }"> {{kt("Together")}} </a> |
            <!--{{kt("Play")}} | -->

            <span v-show="!gameId"> <a v-show="!gameId" v-link="{ path: '/ludi/games' }"> {{kt("Games")}} </a> | </span>
            <span v-show="gameId">  <a  v-link="{ path: '/ludi/play' }"> {{kt("Play")}} </a> | </span>
            <a v-link="{ path: '/ludi/lingvo' }"> {{kt("Language")}} </a>
            | <a v-link="{ path: '/ludi/about' }"> {{kt("About")}}  </a>

            <span v-show="gameId"> | <a v-link="{ path: '/ludi/files' }"> {{kt("Files")}} </a>  </span>

            </h2>

        </div>

       <div class="ludi_bottom" id="ludi_bottom">

            <router-view></router-view>

        </div>

  </div>

</template>

<script>

	import store from '../vuex/store'
	import { getKTranslator, getGameId } from '../vuex/getters'
	import * as actions from '../vuex/actions'

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
       kt: getKTranslator,
       gameId: getGameId,
    },
    actions: actions
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

html {
}

body {
  display: flex;
  justify-content: center;
  height: 100%;
  font-size:20px;
}

/*
body {
    font-size:1em;
}
*/

body {
    font-size: 2em;
}

@media screen  and (min-device-width: 1200px)  and (max-device-width: 1600px)  and (-webkit-min-device-pixel-ratio: 1),
        screen  and (min-device-width: 1200px)  and (max-device-width: 1600px)  and (-webkit-min-device-pixel-ratio: 2)  and (min-resolution: 192dpi) {
  body {
      font-size: 1em;
  }
}

@media screen and (min-resolution: 350dpi),
       screen and (min-resolution: 2dppx) {
  body {
      font-size: 2.5em;
  }
}


/*

@media screen
  and (-webkit-device-pixel-ratio: 2)  and (orientation: portrait) {
    body {
        font-size: 2.3em;
    }
}

@media screen
  and (-webkit-device-pixel-ratio: 2)  and (orientation: landscape) {

    body {
        font-size: 1.2em;
    }
}

*/

#app {
  color: #2c3e50;
  /*max-width: 600px;*/
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: center;
}

#app a {
  color: #42b983;
  text-decoration: none;
}

div.ludi {
    overflow: hidden;
    height: 100%;
    width: 100%;
    //border: 1px solid gray;
}

div.ludi_top1 {
   left: 0px;
   top: 0px;
   width: 100%;
   border: 1px solid red;
   position: fixed;

   /*border-bottom:1px solid #eb7429; */
   background:#fc9400;
   padding:10px 20px;
   z-index:100;

}

div.ludi_bottom {

  width: 100%;
   /*position: static;
    top: 200px;

    left:0px;
    width: 100%;
    border: 1px solid yellow;
    overflow:scroll;
    */


}

h2 {
    font-size:1em;
}

h3 {
    font-size:.7em;
}

</style>
