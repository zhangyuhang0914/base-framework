<template lang="pug">
.list-scroll-wrap
  .wrapper
    ScrollList(:list="list" :rowHeight="30" :viewCount="20")
      template(#="{ item: ele }")
        span {{ ele }}
</template>
<script>
import { defineComponent, ref, onMounted } from 'vue'
import ScrollList from '@/components/c-scroll-list/index.vue'
export default defineComponent({
  name: 'ListScroll',
  components: { ScrollList },
  setup(props, { emit }) {
    const unrealList = ref(2000)
    const list = ref([])
    for (let index = 1; index < unrealList.value; index++) {
      list.value.push(index)
    }
    // 初始化数据
    const initData = () => {
      console.log('initData', list)
    }
    onMounted(() => {
      initData()
    })
    return {
      list
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
