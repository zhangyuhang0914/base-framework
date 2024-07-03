<template lang="pug">
.view-port(ref="viewPortRef" @scroll="onScroll")
  .scrollbar(:style="{height: listHeight + 'px'}")
  .list(ref="listRef" :style="{ transform: `translateY(${transfromOffset}px)` }")
    .row(:style="{ height: rowHeight + 'px' }" v-for="(item, index) in dataList" :key="index")
      slot(:item="item")
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
export default defineComponent({
  name: 'ScrollList',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    rowHeight: {
      type: Number,
      default: 50
    },
    viewCount: {
      type: Number,
      default: 10
    }
  },
  emits: ['bottomLoad'],
  setup(props, { emit }) {
    // 可视区域DOM节点
    const viewPortRef = ref(null)
    // 列表DOM节点
    const listRef = ref(null)
    // 可视区域高度
    const viewHeight = ref(0)
    // 开始索引
    const startIndex = ref(0)
    // 结束索引
    const endIndex = ref(0)
    // 列表偏移量
    const transfromOffset = ref(0)
    // 计算列表总高度
    const listHeight = computed(() => {
      return props.list.length * props.rowHeight
    })
    // 展示的数据
    const dataList = computed(() => {
      return props.list.slice(startIndex.value, endIndex.value)
    })
    // 初始化数据
    const initData = () => {
      endIndex.value = props.viewCount
      viewHeight.value = viewPortRef.value.offsetHeight // viewPortRef.value.style.height
    }
    // 监听滚动
    const onScroll = e => {
      // 偏移量
      const scrollTop = e.target.scrollTop // viewPortRef.value.scrollTop
      // 计算当前索引
      const currentIndex = Math.floor(scrollTop / props.rowHeight)
      // 滚动需要变化时，重新计算赋值
      if (startIndex.value !== currentIndex) {
        startIndex.value = currentIndex
        endIndex.value = startIndex.value + props.viewCount
        transfromOffset.value = scrollTop - (scrollTop % props.rowHeight)
      }
      // 触底了
      if (viewHeight.value + scrollTop === listHeight.value) {
        // 发送触底事件
        emit('bottomLoad')
      }
    }
    onMounted(() => {
      initData()
    })
    return {
      viewPortRef,
      listRef,
      listHeight,
      transfromOffset,
      dataList,
      onScroll
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
