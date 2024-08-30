<template lang="pug">
.error-page
  .content.noFound 404
  .content {{ $t('您访问的页面不存在') }}
  .foot(@click="back") back
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: '404',
  setup() {
    const router = useRouter()
    return {
      back: () => {
        router.go(-1)
      }
    }
  }
})
</script>
<style lang="stylus" scoped>
.error-page
  text-align center
  display flex
  flex-direction column
  justify-content center
  align-items center
  font-size 28px
  color #999
  height 100%
  width 100%
  .noFound
    font-size 80px
    padding-bottom 40px
  .foot
    margin-top 200px
    cursor pointer
    .btn
      background #1989fa
      padding 0 80px
</style>
