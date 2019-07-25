<template>
  <div id="app">
    {{ activePoke }}
    <nest-card class="card__field" v-for="(card, i) in game" :card="card" :key="i"></nest-card>
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
      game: [

      ]  
    }
  },
  computed: {
    activePoke () {
      return this.$store.state.activePoke
    }
  },
  methods: {
    makeCard (length, cardNumbers, deep = 0, upperCard) {
      let number = cardNumbers.shift()
      const nowCard = {
        number,
        deep,
        next: null
      }

      if (length > deep) {
        nowCard.next = this.makeCard(length, cardNumbers, deep + 1, nowCard)
      }
      return nowCard
    }
  },
  mounted () {
    const numbers = Array.from({ length: 52 }, (v, i) => i)
    const rndNumbers = []
    for (let i = 0; i < 52; i++) {
      let index = Math.floor((52 - i) * Math.random())
      rndNumbers.push(...numbers.splice(index, 1))
    }

    for (let i = 2; i <= 9; i++) {
      this.game.push(this.makeCard(i, rndNumbers))
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
  display flex
</style>
