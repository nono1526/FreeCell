<template>
  <ul
    :style="setTransform()"
    draggable="true"
    @dragstart.stop="dragstart"
    @dragover.prevent
    @dragend.stop="dragend"
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
    dragstart (e) {
      this.$store.commit('setActivePoke', this.card)
    },
    dragend (e) {
      console.log(this.card)
      this.card.getBefore().next = null
    },
    setTransform () {
      if (this.card.deep !== 0) {
        return {
          marginTop: '-110px'
        }
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
