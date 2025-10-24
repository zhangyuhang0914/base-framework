<template lang="pug">
.scrollList
  VanPullRefresh.vanScrollBox(
    v-if="isPullUp"
    ref="vanPullRefreshRef"
    :class="className"
    v-model="refreshing"
    @refresh="onDownRefresh"
    :pullingText="pullingText"
    :loosingText="loosingText"
    :loadingText="loadingText"
    :successText='successText'
    :headHeight="headHeight"
    :disabled="!isPullDown"
  )
    VanList(
      ref="vanListRef"
      v-model:loading="loading"
      :finished="pullUpFinish"
      :loading-text="loadingText"
      :immediate-check="immediateCheck"
      :offset="offset"
      :finished-text="pullUpFinish ? (hideMoreTip ? '' : finishTxt) : '查看更多'"
      @load="onLoad"
    )
      slot(name="list")
  VanList(
    v-else
    ref="vanListRef"
    v-model:loading="loading"
    :finished="pullUpFinish"
    :loading-text="loadingText"
    :immediate-check="immediateCheck"
    :offset="offset"
    :finished-text="pullUpFinish ? (hideMoreTip ? '' : finishTxt) : '查看更多'"
    @load="onLoad"
  )
    slot(name="list")
</template>

<script lang="ts">
import type { ListInstance } from 'vant'
import { defineComponent, ref, watch } from 'vue'
export default defineComponent({
  name: 'CSroll',
  props: {
    className: {
      type: [String, Array],
      default: 'hide-scroll'
    },
    // 是否下拉刷新
    isPullDown: {
      type: Boolean,
      default: true
    },
    // 是否上拉加载
    isPullUp: {
      type: Boolean,
      default: true
    },
    // 是否在下拉加载中
    pullDown: {
      type: Boolean,
      default: false
    },
    // 上拉加载状态
    pullUp: {
      type: Boolean,
      default: false
    },
    // 是否已加载完成，加载完成后不再触发load事件
    pullUpFinish: {
      type: Boolean,
      default: false
    },
    // 下拉过程文案
    pullingText: {
      type: String,
      default: () => '下拉即可刷新'
    },
    // 释放过程文案
    loosingText: {
      type: String,
      default: () => '释放即可刷新'
    },
    // 加载过程文案
    loadingText: {
      type: String,
      default: () => '加载中..'
    },
    // 加载成功提示文案
    successText: {
      type: String,
      default: () => '刷新成功'
    },
    headHeight: {
      type: Number,
      default: 50
    },
    // 加载完成后的提示文案
    finishTxt: {
      type: String,
      default: () => '暂无更多'
    },
    // 是否在初始化时立即执行滚动位置检查
    immediateCheck: {
      type: Boolean,
      default: true
    },
    // offset 滚动条与底部距离小于 offset 时触发load事件
    offset: {
      type: Number,
      default: 30
    },
    // 隐藏load没有更多提示
    hideMoreTip: {
      type: Boolean,
      default: false
    }
  },
  emits: ['refresh', 'onLoad'],
  setup(props, context) {
    const vanPullRefreshRef = ref()
    const vanListRef = ref<ListInstance>()
    const refreshing = ref(false)
    const loading = ref(false)
    watch(
      () => props.pullDown,
      data => {
        refreshing.value = data
      }
    )
    watch(
      () => props.pullUp,
      data => {
        loading.value = data
      }
    )
    // 刷新
    const onDownRefresh = () => {
      context.emit('refresh')
    }
    // 加载
    const onLoad = () => {
      context.emit('onLoad')
    }
    // 检查当前的滚动位置，若已滚动至底部，则会触发 load 事件
    const checkPosition = () => {
      vanListRef.value && vanListRef.value?.check()
    }
    context.expose({
      checkPosition
    })
    return {
      vanPullRefreshRef,
      vanListRef,
      refreshing,
      loading,
      onDownRefresh,
      onLoad,
      checkPosition
    }
  }
})
</script>

<style lang="scss" scoped>
.scrollList {
  width: 100%;
  height: 100%;
  padding: 24px 0;
  .vanScrollBox {
    width: 100%;
    height: 100%;
    text-align: left;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
