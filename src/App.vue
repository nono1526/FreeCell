<template>
  <div id="app">
    <nest-card :card="cards"></nest-card>
  </div>
</template>

<script>
import NestCard from './components/NestCard.vue'

export default {
  name: 'app',
  components: {
    NestCard
  },
  data () {
    return {
      cards: {
        number: 1,
        type: 'diamond',
        next: {
          number: 2,
          type: 'diamond',
          next: {
            number: 3,
            type: 'diamond',
            next: null
          }
        }
      }
    }
  }
}
</script>
<style lang="stylus">
html, body
  padding 0
  margin 0
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
</style>
