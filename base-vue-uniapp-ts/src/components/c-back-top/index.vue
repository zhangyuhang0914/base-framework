<template lang="pug">
u-transition(:show="visibleBack" mode="fade")
  .c-back-top(:class="mode" @click="pinToTop")
    up-icon(name="arrow-upward" size="20" color="#847855" :custom-style="iconStyle")
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'CBackTop',
  props: {
    scrollTop: {
      type: Number || String,
      default: 0
    },
    top: {
      type: Number || String,
      default: 400
    },
    mode: {
      type: String,
      default: 'circle'
    },
    iconStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    scrollBackTop: {
      type: Function,
      default: () => {}
    }
  },
  emits: ['scrollBackTop'],
  setup(props, { emit }) {
    const pinToTop = () => {
      if (props.scrollBackTop) {
        emit('scrollBackTop')
      } else {
        if (props.scrollTop > props.top) {
          console.log('pageScrollTo')
          uni.pageScrollTo({
            scrollTop: 0,
            duration: 300
          })
        }
      }
    }
    const visibleBack = computed(() => {
      return props.scrollTop > props.top
    })
    return {
      pinToTop,
      visibleBack
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
