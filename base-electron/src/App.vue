<template lang="pug">
.layout-wrap
  router-view(v-slot="{ Component }")
    component(:is="Component")
</template>
<script>
export default {
  name: 'App'
}
</script>
<style lang="stylus" scoped>
@import './assets/app.styl'
@import './assets/element.styl'
.layout-wrap
  width 100%
  height 100%
</style>
