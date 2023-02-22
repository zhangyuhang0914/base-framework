<template lang="pug">
.loading-wrap
  .c-loading
    span
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
  position: absolute
  width: 100%
  height: 100%
  top: 0
  left: 0
  background: rgba(225,225,225,0.5)
  display: flex
  justify-content: center
  align-items: center
  .txt
    font-size 14px
    color $text-practice
  .c-loading
    width: 30px
    height: 30px
    position: relative
    span
      display: inline-block;
      width: 1px;
      height: 8px;
      border-top-left-radius: 1px;
      border-bottom-left-radius: 1px;
      background:#000
      position: absolute;
      -webkit-animation: load 1.04s ease infinite
      &:nth-child(1)
        left: 0;
        top: 0px
        // margin-top:-5px;
        -webkit-animation-delay:0.12s;
      &:nth-child(2)
        left: 4px;
        top: 2px;
        -webkit-transform: rotate(30deg);
        -webkit-animation-delay:0.24s;
      &:nth-child(3)
        left: 7px;
        top: 6px;
        -webkit-transform: rotate(60deg);
        -webkit-animation-delay:0.36s;
      &:nth-child(4)
        left: 8px;
        top: 10px;
        -webkit-transform: rotate(90deg);
        -webkit-animation-delay:0.48s;
      &:nth-child(5)
        left: 8px;
        top: 10px;
        -webkit-transform: rotate(120deg);
        -webkit-animation-delay:0.60s;
@-webkit-keyframes load
  0%{
      opacity: 1;
  }
  100%{
      opacity: 0.2;
  }

</style>
