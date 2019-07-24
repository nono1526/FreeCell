<template>
  <draggable tag="ul" >
    <li>
      <v-card
        :style="{transform:`translateY(-80px)`}"
        :number="card.number"
        :type="card.type">
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
  }

}
</script>

<style lang="stylus" scoped>
  ul
    list-style none
    margin 0
    padding 0
</style>
