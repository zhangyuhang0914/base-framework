<template lang="pug">
.layout-wrap
  router-view(v-slot="{ Component }")
    transition(name="fade" mode="out-in")
      keep-alive(include="list-scroll")
          component(:is="Component")
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'layout',
  setup() {
    return {}
  },
  beforeRouteLeave(to, from, next) {
    console.log('beforeRouteLeave', to, from, next)
  }
})
</script>
<style lang="stylus" scoped>
@import './index.styl'
</style>
