<template lang="pug">
.list-scroll-wrap
  .wrapper(ref="wrapperRef" @scroll="wrapperScroll($event)")
    .wrapper-scroll(:style="{ height: containerHeight + 'px' }")
      .transfrom(:style="{ transform: `translateY(${scrollTopOffset}px)` }")
        .c-list(v-for="(item, index) in showItem" :key="index")
          span {{ item }}
</template>
<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
export default defineComponent({
  name: 'ListScroll',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    rowHeight: {
      type: Number,
      default: 200
    },
    viewCount: {
      type: Number,
      default: 10
    }
  },
  setup(props, { emit }) {
    const unrealList = ref(2000)
    const list = ref([])
    for (let index = 0; index < unrealList.value; index++) {
      list.value.push(index)
    }
    // 容器DOM节点
    const wrapperRef = ref(null)
    const containerHeight = ref(unrealList.value * 40)
    // 容器高度
    const wrapperHeight = ref(0)
    // 显示容器数量
    const itemNum = ref(0)
    // 容器偏移量
    const scrollTopOffset = ref(0)
    // 当前开始索引
    const startKey = ref(0)
    // 初始化数据
    const initData = () => {
      // 获取整个容器高度
      wrapperHeight.value = wrapperRef.value.clientHeight
      // 实际显示DOM数量
      itemNum.value = Math.ceil(wrapperHeight.value / 40)
      console.log('initData', wrapperHeight.value, itemNum.value)
    }
    // 监听滚动
    const wrapperScroll = e => {
      // 计算当前状态索引
      let temp = Math.floor(e.target.scrollTop / 40)
      // 当前状态的索引发生变化才触发列表刷新
      if (temp !== startKey.value) {
        startKey.value = temp
        scrollTopOffset.value = e.target.scrollTop
      }
    }
    // 对数据进行切片处理
    const showItem = computed(() => {
      console.log(':style', scrollTopOffset.value)
      return [
        ...list.value.slice(startKey.value, itemNum.value + startKey.value + 3)
      ]
    })
    onMounted(() => {
      initData()
    })
    return {
      unrealList,
      wrapperRef,
      containerHeight,
      scrollTopOffset,
      wrapperScroll,
      showItem
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
