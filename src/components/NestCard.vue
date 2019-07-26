<template>
  <ul
    :style="setTransform()"
    :draggable="card.draggable()"
    @dragstart.stop="dragstart"
    @dragover.prevent
  >
    <li>
      <v-card
        :number="card.number">
      </v-card>
      <nest-card  v-if="card.next" :card="card.next"></nest-card>
    </li>
  </ul>
</template>

<script>
import VCard from './VCard'
export default {
  name: 'nest-card',
  components: {
    VCard
  },
  props: {
    card: Object
  },
  methods: {
    isSequence (card, upperCard = null) {
      let number = this.card.number % 13 + 1
      let upperNumber = upperCard ? upperCard.number % 13 + 1 : number + 1
      if (!card.next) return upperNumber - number === 1
      return upperNumber - number === 1 && this.isSequence(card.next, card)
    },
    dragstart (e) {
      this.$store.commit('setActivePoker', this.card)
    },
    setTransform () {
      let marginTop = this.card.deep
        ? this.card.finish
          ? '-143px'
          : '-105px'
        : 0
      return {
        marginTop
      }
    }
  }

}
</script>

<style lang="stylus" scoped>
  ul
    user-select none
    list-style none
    margin 0
    padding 0
    li
      user-select none
</style>
