<template lang="pug">
.c-scroll-wrap
  van-pull-refresh.vanScrollBox(
    ref="vanScrollBox"
    :class="className"
    v-model="pullDownFlag"
    @refresh="onDownRefresh"
    :pullingText="pullingText"
    :loosingText="loosingText"
    :loadingText="loadingText"
    :successText='isPullEnd ? finishTxt : successText'
    :headHeight="headHeight"
    :disabled="!isPullDown"
  )
    template(v-if="isPullUp")
      van-list(
        v-model:loading="pullUpFlag"
        :finished="pullUpFinish"
        :loading-text="loadingText"
        :immediate-check="immediateCheck"
        :offset="offset"
        :finished-text="hideMoreTip ? '' : finishTxt"
        @load="onLoad"
      )
        slot
    template(v-else)
      slot
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
export default defineComponent({
  name: 'CSroll',
  props: {
    className: {
      type: [String, Array],
      default: 'hide-scroll'
    },
    isPullDown: {
      type: Boolean,
      default: true
    },
    // 是否在下拉加载中
    pullDown: {
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
    isPullEnd: {
      type: Boolean,
      default: false
    },
    headHeight: {
      type: Number,
      default: 50
    },
    // 是否上拉加载
    isPullUp: {
      type: Boolean,
      default: false
    },
    // 是否已加载完成，加载完成后不再触发load事件
    pullUpFinish: {
      type: Boolean,
      default: true
    },
    // 加载完成后的提示文案
    finishTxt: {
      type: String,
      default: () => '没有更多数据'
    },
    // 是否在初始化时立即执行滚动位置检查
    immediateCheck: {
      type: Boolean,
      default: true
    },
    // offset 滚动条与底部距离小于 offset 时触发load事件
    offset: {
      type: Number,
      default: 300
    },
    // 加载状态
    pullUp: {
      type: Boolean,
      default: false
    },
    // 隐藏load没有更多提示
    hideMoreTip: {
      type: Boolean,
      default: false
    }
  },
  emits: ['refresh', 'onLoad'],
  setup(props, context) {
    const vanScrollBox = ref()
    const pullDownFlag = ref(false)
    const pullUpFlag = ref(false)
    watch(
      () => props.pullDown,
      data => {
        pullDownFlag.value = data
      }
    )
    watch(
      () => props.pullUp,
      data => {
        pullUpFlag.value = data
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
    return {
      vanScrollBox,
      pullDownFlag,
      pullUpFlag,
      onDownRefresh,
      onLoad
    }
  }
})
</script>

<style lang="stylus" scoped>
.c-scroll-wrap
  width 100%
  height 100%
  .vanScrollBox
    height 100%
    width 100%
    text-align left
    overflow-y auto
    overflow-x hidden
  :deep(.van-pull-refresh__head)
    transform translate3d(0px,-30px, 0px)
    .loadingBox
      display flex
      align-items center
      justify-content center
    @keyframes lds-rolling
      0%
        -webkit-transform translate(0, 0) rotate(0deg)
        transform translate(0, 0) rotate(0deg)
      100%
        -webkit-transform translate(0, 0) rotate(360deg)
        transform translate(0, 0) rotate(360deg)

    .loading
      animation lds-rolling 0.7s linear infinite
      width 40px
      height 40px
      border 4px solid #1c90fb
      border-top-color transparent
      border-radius 50%
    .loadingTxt
      padding-left 10px
</style>
