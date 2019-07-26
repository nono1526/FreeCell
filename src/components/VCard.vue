<template>
  <div
    :style="{
      backgroundImage: `url(/cards/${type}_${cardNumber}.png)`,
      width: `92px`,
      height: `143px`
    }"
  >

  </div>
</template>

<script>
const TYPE_MAPPING = ['club', 'diamond', 'spade', 'heart']
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
