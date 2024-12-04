<template lang="pug">
.header-wrap
  .back
    van-icon.back-icon(name="arrow-left" v-show="back" @click="goBack")
    slot(name="left")
  .title-box
    slot(name="title")
      .ellipsis.title {{ title }}
  .opration
    slot(name="right")
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'CHeader',
  props: {
    back: {
      type: Boolean,
      default: true
    },
    title: String
  },
  setup() {
    const router = useRouter()
    const goBack = () => {
      router.go(-1)
    }
    return {
      goBack
    }
  }
})
</script>

<style lang="stylus" scoped>
.header-wrap
  height 44px
  width 100%
  display flex
  align-items center
  background #3598DB
  & > div
    flex none
  .title-box
    flex 1
    overflow hidden
  .back,.opration
    min-width 60px
    padding 0 15px
  .back-icon
    font-size 20px
    color #FFFFFF
  .title-box
    display flex
    flex-direction column
    .title
      font-weight bold
      text-align center
      color #FFFFFF
      font-size 18px
</style>
