<template>
  <div class="kun">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>

import kunLogin from './KunLogin'

export default {
  data () {
    return {
      msg: 'Kun: ' + kunLogin.userId
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
