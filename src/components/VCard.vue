<template>
  <img :src="`/cards/${type}_${number}.png`">
</template>

<script>
export default {
  name: 'v-card',
  props: {
    type: String,
    number: [String, Number]
  }
}
</script>

<style>

</style>
