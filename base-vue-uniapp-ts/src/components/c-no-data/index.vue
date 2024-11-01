<template lang="pug">
.nodatas
  .c-image(v-if="showImg" :style="{ background: `url(${previewImg('wx_common_no-data')})`, backgroundRepeat: 'no-repeat', backgroundSize: '100%', backgroundPosition: '50%' }")
  .c-label {{ '暂无数据' }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { previewImg } from '@/util/utils'

export default defineComponent({
  name: 'CNoData',
  props: {
    showImg: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    return {
      previewImg
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
