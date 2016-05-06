<template>
  <div class="ludi-game-detail">
    <h2> Details: {{game | json }} </h2> 
    <h2> About: {{about | json }} </h2> 
    <ul>
    <li v-show="game.name" >
    <!-- to-do: dispath message to parent: https://vuejs.org/guide/components.html#Parent-Child-Communication -->
    <button v-on:click="load(game.name)">Load game</button>   
    </li>
    </ul>
  </div>
</template>

<script>

export default {
  data () {
	
    return {
      about: {}
    }
  },
   watch: {
		// to-do: $watch for game -> 
		'game': function (val, oldVal) {
			this.about = {comment: 'to-do: load about'}
		}
  },  
  ready: function () {
      this.about= {comment: 'not loaded yet'}
  },
  methods: {
      load: function (id) {
          // to-do: load modules of gameId
          // to-do: must update gameId of parent after loading the modules
		  
          this.$parent.newgameid = id;
      }
  },
  props: ['game']
    
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
</style>



