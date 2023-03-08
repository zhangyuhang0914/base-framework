<template lang="pug">
.layout-wrap
  customBar(:showStick="showStick")
  .container-main(:class="showStick ? 'active-stick' : 'default-stick'")
    slot(name='main')
  CustomTabBar
</template>

<script>
import { defineComponent } from 'vue'
import customBar from '@/component/custom-bar'
import customTabBar from '@/component/custom-tab-bar'
export default defineComponent ({
  name: 'layout',
  components: { customBar, customTabBar },
  props: {
    showStick: {
      type: Boolean,
      default: false
    }
  },
  setup (prop, context) {

  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
