<template>
  <div class="ludi">
    <h1>Ludi</h1>
	<h2 v-show="gameId"> gameId: {{ gameId}} </h2> 
	<a v-show="gameId==''" v-link="{ path: '/ludi/games' }"> Games | </a>
	<a v-show="gameId!=''" v-link="{ path: '/ludi/play' }"> Play | </a>
	<router-view></router-view>
  </div>
</template>

<script>

export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      gameId: '' 
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

html {
  height: 100%;
}

body {
  display: flex;
  justify-content: center;
  height: 100%;
}

#app {
  color: #2c3e50;
  max-width: 600px;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: center;
}

#app a {
  color: #42b983;
  text-decoration: none;
}

.logo {
  width: 100px;
  height: 100px
}


</style>
