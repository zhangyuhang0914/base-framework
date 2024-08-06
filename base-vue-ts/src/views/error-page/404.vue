<template lang="pug">
.error-page
  .content.noFound 404
  ElButton.back(type="primary" @click="back") {{ '返回首页' }}
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { ElButton } from 'element-plus'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: '404',
  components: { ElButton },
  setup() {
    const router = useRouter()
    return {
      back: () => {
        router.replace('/')
      }
    }
  }
})
</script>
<style lang="stylus" scoped>
.error-page
  width 100%
  height 100%
  padding 30% 0
  text-align center
  display flex
  flex-direction column
  align-items center
  font-size 28px
  color #999
  .noFound
    color $primaryBtnBackground
    font-size 160px
    padding-bottom 40px
  .back
    height auto
    font-size 18px
</style>
