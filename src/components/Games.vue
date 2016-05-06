<template>
  <div class="games">
	<div v-show="!gameloaded">
		<h1> You must load a game to play</h1>
	      <p>Please, choose game to load
        <ul>
            <li v-for="game in games">
                <!-- <a v-link="{ path: '/ludi/game/'+game.name }">{{ game | json  }} </a><br/> -->
                <!-- <a v-link="{ name: 'gameDetail', params: {  gameId: game.name }}"> {{game.name}}</a> <br/> -->
                <button v-on:click="currentgame=game">{{game.name}}</button>   
            </li>
        </ul>
        <ludi-game-detail :game="currentgame"></ludi-game-detail>
	</div>
	<div v-else>
		<!-- <h2> Game loaded. gameId: {{ ludiRunner.gameId}} </h2> 
		<h2 v-show="gameloaded"> Games data: {{ games } | json} </h2>  -->
		<play>
	</div>
    
  </div>
</template>

<script>

    import LudiGameDetail from './LudiGameDetail.vue'
    import Play from './Play.vue'

/*
    C:\desarrollo\vue\vue-cli\kunludi\src\components\ludiGames\tresfuentes\v0.01\LudiGameReactions.js
    C:\desarrollo\vue\vue-cli\kunludi\src\components\ludiLibs\v0.01\LudiLibReactions.js

*/

//import ludiRunner from './LudiRunner'

export default {
    
   components: {
        LudiGameDetail, Play
   },
   
  data () {
	  
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      
	  msg: 'Ludi: ',
      ludiRunner: {},
      currentgame: {},
      games: {},
      newgameid: '',
	  gameId: ''
    }
  },
   watch: {
		'newgameid': function (val, oldVal) { // changed from gameDetail
			this.gameId = val;
			this.$parent.gameId = val;
		}
  },  
  computed: {
     gameloaded: function () { return (this.gameId !== ""); }    
  },
  ready: function(){
    this.loadGames();
  },
  methods: {
    loadGames () {
		this.ludiRunner = require ('./LudiRunner');
		if (this.ludiRunner != {} ) this.ludiLoaded = true; // should be calculated

		this.games = [
		  {
			name: "tresfuentes",
			type: "0",
			group: "0"
		  },
		  {
			name: "texel",
			type: "0",
			group: "1"
		  },
		  {
			name: "vampiro",
			type: "0",
			group: "0"
		  },
		  {
			name: "tresfuentes",
			type: "1",
			group: "0",
			baseurl: "http://www.kunludi.com/client/data/games/"
		  }
		];
	  
		/*
        this.$http.get('http://localhost:8888/client/data/games.json', function(data, status, request){
              if(status == 200)  {
                this.games = data.games;
				console.log ("games: " + JSON.stringify (this.games))
            }
        });
		*/
    }
  } 
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
</style>



