<template lang="pug">
.layout-wrap
  HelloWorld(msg="Vite + Vue")
  router-view(v-slot="{ Component }")
    keep-alive
      component(
        v-if="$route.meta.keepAlive"
        :key="$route.name"
        :is="Component"
      )
    component(
      v-if="!$route.meta.keepAlive"
      :key="$route.name"
      :is="Component"
    )
</template>
<script>
import HelloWorld from '@/components/HelloWorld.vue'
export default {
  name: 'App',
  components: { HelloWorld }
}
</script>
<style lang="stylus" scoped>
@import './assets/app.styl'
@import './assets/element.styl'
.layout-wrap
  width 100%
  height 100%
</style>
