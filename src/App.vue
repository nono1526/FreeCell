<template>
  <div id="app">
    <div class="card__field"
      v-for="(cards, i) in game"
      :key="i"
      @dragover.prevent
      @drop="drop(cards)"
    >
      <nest-card
        :card="cards"
        >
      </nest-card>
    </div>
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
      game: []
    }
  },
  computed: {
    activePoke () {
      return this.$store.state.activePoke
    }
  },
  methods: {
    cardToNumbers (card) {
      let next = []
      if (card.next) {
        next = this.cardToNumbers(card.next)
      }
      return [card.number, ...next]
    },
    drop (cards) {
      const lastCard = this.findLastCard(cards)
      const numbers = this.cardToNumbers(this.activePoke)
      lastCard.next = this.makeCard(numbers.length + lastCard.deep, numbers, lastCard.deep + 1, lastCard)
      // console.log(this.activePoke)
    },
    findLastCard (card) {
      return card.next ? this.findLastCard(card.next) : card
    },
    makeCard (length, cardNumbers, deep = 0, upperCard = null) {
      let number = cardNumbers.shift()
      console.log(deep)
      const nowCard = {
        number,
        deep,
        next: null,
        getBefore () {
          return upperCard
        }
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
    console.log(this.game)
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
.cards
  display flex
.dragging
  opacity 1
</style>
