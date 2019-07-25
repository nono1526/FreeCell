<template>
  <img :src="`/cards/${type}_${cardNumber}.png`">
</template>

<script>
const TYPE_MAPPING = ['club', 'diamond', 'heart', 'spade']
export default {
  name: 'v-card',
  props: {
    number: [String, Number]
  },
  computed: {
    type () {
      const typeIndex = Math.floor(this.number / 13)
      return TYPE_MAPPING[typeIndex]
    },
    cardNumber () {
      return this.number % 13 + 1
    }
  }
}
</script>

<style>

</style>
