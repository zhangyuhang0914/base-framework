<template lang="pug">
.page-wrap
  .test-select
    div {{ 'home' }}
    div(style="cursor: pointer" @click="toLink") {{ '404' }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'About',
  props: {
    width: {
      type: String || Number,
      default: '100%'
    }
  },
  setup(props, context) {
    const router = useRouter()
    const toLink = () => {
      router.push({
        name: '404'
      })
    }
    return {
      toLink
    }
  }
})
</script>

<style lang="stylus" scoped>
.test-select
  display flex
  flex-direction column
  align-items center
  justify-content center
  .page-wrap
    width 50%
</style>
