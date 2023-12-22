<template lang="pug">
.page-wrap
  router-view(v-slot="{ Component }")
    transition(name="fade" mode="out-in")
        component(:is="Component" :key="route.name")
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'Layout',
  setup(props) {
    const route = useRoute()
    return {
      route
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
