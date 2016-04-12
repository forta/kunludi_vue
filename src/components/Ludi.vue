<template>
  <div class="ludi">
    <h1>uno</h1>
    <h1>{{ msg }} </h1>
    <h1>{{ users | json }} </h1>
    <h1>{{ kernelMSG | json }} </h1>

    <button v-on:click="reverseMessage">Reverse Message</button>

<!--

// kernel messages in each language
for (m in kernelMSG[0].messages) {
	console.log("Kernel messageId [" + m + "]:");
	for (var l in kernelMSG) {
		console.log("\t" + kernelMSG[l].lang + ":" + kernelMSG[l].messages[m].message );
	}
}

// lib messages in each language
for (m in libMSG[0].messages) {
	console.log("Lib messageId [" + m + "]:");
	for (var l in libMSG) {
		console.log("\t" + libMSG[l].lang + ":" + libMSG[l].messages[m].message );
	}
}
-->

    
  </div>
</template>

<script>

import ludiRunner from './LudiRunner'

export default {
  data () {
	  
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Ludi: ' + ludiRunner.gameId,
      kernelMSG: ludiRunner.kernelMSG,
      users: {a:1}
    }
  },
  ready: function(){
    this.loadUsers();
  },
  methods: {
    reverseMessage: function () {
      this.users = {a:2};
    }, loadUsers () {
      this.users = {a:3};
        alert('jua');
        this.$http.get('http://jsonplaceholder.typicode.com/users', function(data, status, request){
            if(status == 200)  {
                this.users = data;
            }
        });        
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



