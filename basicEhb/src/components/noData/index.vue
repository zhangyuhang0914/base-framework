<template lang="pug">
.noData
  VanImage(width="50%" height="auto" :src="getImage('common.noData')" fit="contain")
  span.text(v-if="showText") {{ text }}
</template>

<script lang="ts">
import { getImage } from '@/constants/images'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NoData',
  props: {
    showText: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '暂无数据'
    }
  },
  setup() {
    return {
      getImage
    }
  }
})
</script>

<style lang="scss" scoped>
.noData {
  @include flexColumnCenter;
  .text {
    color: $backgroundPrimary;
  }
}
</style>
