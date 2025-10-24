<template lang="pug">
.noData
  VanImage(width="50%" height="auto" :src="getImage('common.noData')" fit="contain")
</template>

<script lang="ts">
import { getImage } from '@/constants/images'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NoData',
  setup() {
    return {
      getImage
    }
  }
})
</script>

<style lang="scss" scoped></style>
