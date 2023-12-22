<template>
  <div class="home">
    <img alt="Vue logo" :src="`${base_url}images/logo.png`" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'HomeView',
  components: {
    HelloWorld
  },
  setup() {
    const base_url = process.env.BASE_URL
    return {
      base_url
    }
  }
})
</script>
