<template lang="pug">
.layout-wrap
  .layout-top
    HeaderCommon
  .layout-bottom
    router-view(v-slot="{ Component }")
      transition(name="fade" mode="out-in" v-if="$route.meta.keepAlive")
        keep-alive
          component(
            :key="$route.name"
            :is="Component"
          )
      transition(name="fade" mode="out-in" v-if="!$route.meta.keepAlive")
        component(
          :key="$route.name"
          :is="Component"
        )
</template>

<script>
import HeaderCommon from '@/views/template/layout/headerCommon/index.vue'
export default {
  name: 'layout',
  components: { HeaderCommon },
  setup() {}
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
