<template lang="pug">
.c-wrap
  router-view(v-slot="{ Component }")
    component(:is="Component")
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    console.log('app.vue')
  }
})
</script>

<style lang="stylus" scoped>
.vuee
  font-size 30px
</style>
