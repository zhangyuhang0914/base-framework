<template lang="pug">
.loading-wrap
  .c-loading
    span
    span
    span
    span
  .txt(v-show="title") {{ title }}
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'Loading',
  props: {
    txt: String
  },
  setup(props) {
    const title = ref(props.txt)
    const setTitle: any = (val: any) => {
      title.value = val
    }
    return {
      setTitle,
      title
    }
  }
})
</script>
<style lang="stylus" scoped>
.loading-wrap
  position absolute
  width 100%
  height 100%
  top 0
  left 0
  background rgba(225, 225, 225, 0.5)
  display flex
  justify-content center
  align-items center
  .txt
    font-size 14px
    color #878B99
  .c-loading
    position relative
    transition-property padding, opacity
    transition-duration 0.2s, 0.2s
    transition-timing-function ease-in, ease
    transition-delay 0s, 0.2s
    span
      width 35px
      height 35px
      border 3.7px solid #53B9FF
      border-radius 50%
      box-sizing border-box
      display inline-block
      position absolute
      animation load 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite
      border-color #53B9FF transparent transparent transparent
      &:nth-child(1)
        animation-delay 0.45s
      &:nth-child(2)
        animation-delay 0.3s
      &:nth-child(3)
        animation-delay 0.15s
@-webkit-keyframes load
  0%
    transform rotate(0deg)
  100%
    transform rotate(360deg)
</style>
