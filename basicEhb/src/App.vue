<template lang="pug">
  #appContent
    router-view(v-slot="{ Component, route }")
      component(:is="Component" :key="route.path")
</template>

<script setup lang="ts" name="App"></script>

<style scoped>
#appContent {
  width: 100%;
  height: 100%;
}
</style>
