<template lang="pug">
.hotSearch
  span {{ '热门检索：' }}
  .hotTags
    .tagItem(v-for="(label, index) in hotTags" :key="index") {{ label }}
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'

export default defineComponent({
  name: 'HotSearch',
  setup() {
    const hotKeyword = reactive([
      {
        label: '信号中断'
      },
      {
        label: '网络覆盖不足'
      },
      {
        label: '机顶盒故障'
      }
    ])
    const hotTags = ref<string[]>([])
    onMounted(() => {
      hotTags.value = hotKeyword.map(item => item.label)
    })
    return {
      hotTags
    }
  }
})
</script>

<style lang="scss" scoped>
.hotSearch {
  padding: 10px 21px 30px 21px;
  color: $colorWhite;
  font-size: $fontSize24;
  @include flexAlignCenter;
  .hotTags {
    display: flex;
    gap: $gap16;
    .tagItem {
      padding: 6px 14px;
      background: #2755df;
      border-radius: $borderRadius4;
      @include flexCenter;
    }
  }
}
</style>
