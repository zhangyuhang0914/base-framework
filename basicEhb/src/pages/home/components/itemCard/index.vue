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

<style lang="scss" scoped>
.cardHeader {
  height: 100px;
  padding: 0 21px 0 30px;
  background: linear-gradient(90deg, #3d96e9, #5a75d0);
  border-radius: $borderRadius24 $borderRadius24 0 0;
  @include flex-align-center;
  .cardTitle {
    font-size: $FontSize36;
    color: #ffffff;
  }
}
</style>
