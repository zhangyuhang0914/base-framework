<template lang="pug">
router-view(v-slot="{ Component }")
  component(:is="Component")
</template>
<script>
export default {
  name: 'App'
}
</script>
<style lang="stylus">
@import './assets/app.styl'
@import './assets/element.styl'
</style>
