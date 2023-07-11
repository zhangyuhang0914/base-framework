<template lang="pug">
.layout-wrap
  .layout-top
    HeaderCommon
  .layout-content
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
  .layout-footer
    FooterCommon
</template>

<script>
import HeaderCommon from '@/views/template/layout/header-common/index.vue'
import FooterCommon from '@/views/template/layout/footer-common/index.vue'
export default {
  name: 'Layout',
  components: { HeaderCommon, FooterCommon },
  setup() {}
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
