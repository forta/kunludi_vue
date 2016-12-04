<template>
  <div class="reaction">
   <p> hitem (reaction) -> {{hitem | json }} </p>
  </div>
</template>

<script>

    import store from '../vuex/store'
    import { getGameAbout, getGameId, getLocale, getKTranslator, getGameSlots } from '../vuex/getters'
    import * as actions from '../vuex/actions'

export default {
  data () {

    return {
        languageIndex: -1
    }
  },
  methods: {
  },
  props: ['hitem'],
  store: store,
  vuex: {
    getters: {
       gameId: getGameId,
       locale: getLocale,
       about: getGameAbout,
       kt: getKTranslator,
       gameSlots: getGameSlots
    },
    actions: actions
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
