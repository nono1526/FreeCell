<template>
  <draggable tag="ul" >
    <li>
      <v-card
        :style="setTransform()"
        :number="card.number">
      </v-card>
      <nest-card  v-if="card.next" :card="card.next"></nest-card>
    </li>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import VCard from './VCard'
export default {
  name: 'nest-card',
  components: {
    draggable,
    VCard
  },
  props: {
    card: Object
  },
  methods: {
    setTransform () {
      console.log(this.card.deep)
      if (this.card.deep !== 0) {
        return {
          transform: `translateY(${-143 * this.card.deep + 25 * this.card.deep}px)`
        }
      }
    }
  }

}
</script>

<style lang="stylus" scoped>
  ul
    list-style none
    margin 0
    padding 0
</style>
