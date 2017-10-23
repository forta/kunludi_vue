<template>

  <h1> Ethereum test </h1>
  
	<h3>Numer of users: {{numerOfUsers}} </h3>
	
	
    <div v-if = "!gameStarted">

		<p v-for="(index, w) in wallet">Wallet of user {{index}}: <input v-model="w"></p>
		<p> Bet to play: <input v-model="bet"> </p>
		<button v-on:click="startPlay">start!</button>
	</div>

    <div v-if = "gameStarted">
		<p v-for="(index, w) in wallet">Wallet of user {{index}}: {{w}}</p>
		<p> Bet to play: {{bet}} </p>
		<h2> Current contract </h2>
		<h3>Numer of turns: {{turns}} </h3>

	    <div v-if = "turns == 0">
			<p> Bet in each turn: <input v-model="betTurn"> </p>
		</div>
	    <div v-if = "turns > 0">
			<p> Bet in each turn: {{betTurn}} </p>
		</div>
		<br/>

		<p> User 1: <input v-model="gameWallet[0]"> <button v-on:click="quitGame(0)"> quit game  </button> </p>
		<p> User 2: <input v-model="gameWallet[1]"> <button v-on:click="quitGame(1)"> quit game  </button> </p>
		<p> User 3: <input v-model="gameWallet[2]"> <!-- <button v-on:click="quitGame(2)"> quit game  </button> </p> -->
		
		<p> Total: {{totalContract}} </p>
		
		<button v-on:click="startGame"> Let's play!  </button>
		<button v-on:click="endGame"> Stop playing!  </button>
	</div>


  </div>


</template>
<script>


export default {
  data () {
    return {
	  bet: 10,
	  betTurn: 1,
	  numerOfUsers: 3,
	  wallet: [100, 200, 300],
      gameStarted: false,
	  gameWallet: [],
	  turns: 0,
	  totalContract:0
    }
  },
  methods: {
    startPlay: function () {
      this.gameStarted = true
	  this.turns = 0
	  this.betTurn = 1
	  this.gameWallet[0] = this.gameWallet[1] = this.gameWallet[2] = this.bet
	  // refresh vue
	  this.gameWallet = JSON.parse(JSON.stringify(this.gameWallet)) 

	  this.wallet[0] -= this.bet
	  this.wallet[1] -= this.bet
	  this.wallet[2] -= this.bet
	  // refresh vue
	  this.wallet = JSON.parse(JSON.stringify(this.wallet)) 
	  
	  this.totalContract =  this.gameWallet[0]  + this.gameWallet[1] + this.gameWallet[2]
	  
    }, 
	startGame: function () {
	  var initial = [this.gameWallet[0], this.gameWallet[1], this.gameWallet[2]]
	  var pending = 0

	  this.turns++
	  
	  if (this.gameWallet[0] > 0) {
		this.gameWallet[0] -= this.betTurn / 4
		pending -= (this.gameWallet[0] - initial[0])
	  }
	  
	  if (this.gameWallet[1] > 0) {
		this.gameWallet[1] -= this.betTurn / 8
		pending -= (this.gameWallet[1] - initial[1])
	  }
	  
	  this.gameWallet[2] += pending
	  
	  // refresh vue
	  this.gameWallet = JSON.parse(JSON.stringify(this.gameWallet)) 
	  
	  this.totalContract =  this.gameWallet[0]  + this.gameWallet[1] + this.gameWallet[2]
	  
    },
	quitGame: function (user) {
	  this.wallet[user] += this.gameWallet[user]
	  // refresh vue
	  this.wallet = JSON.parse(JSON.stringify(this.wallet)) 
	  
	  this.gameWallet[user] =  0
	  // refresh vue
	  this.gameWallet = JSON.parse(JSON.stringify(this.gameWallet)) 
	
	},
	endGame: function () {
	  this.wallet[0] += this.gameWallet[0]
	  this.wallet[1] += this.gameWallet[1]
	  this.wallet[2] += this.gameWallet[2]
	  // refresh vue
	  this.wallet = JSON.parse(JSON.stringify(this.wallet)) 
	  
	  this.gameWallet[0] = this.gameWallet[1] = this.gameWallet[2] = 0
	  // refresh vue
	  this.gameWallet = JSON.parse(JSON.stringify(this.gameWallet)) 
	  
	  this.gameStarted = false
	
	}

  }
}
</script>


<style scoped>



</style>
