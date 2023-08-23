<template lang="pug">
router-view(v-slot="{ Component }")
  component(:is="Component")
  span(class="adb") {{ 'asdb' }}
  //- van-button {{ '123' }}
</template>
<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<style lang="stylus">
@import './assets/css/app.styl'
</style>
