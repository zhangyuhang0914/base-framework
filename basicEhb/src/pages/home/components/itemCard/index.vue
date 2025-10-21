<template lang="pug">
.templateCard
  .cardHeader
    .cardTitle {{ title }}
  .cardBody
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ItemCard',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped></style>
