<template lang="pug">
ElConfigProvider
  router-view(v-slot="{ Component }")
    component(:is="Component")
</template>
<script setup>
// // 默认事件
// const firbitFn = (e) => {
//   e.preventDefault()
// }
// // 禁用右键
// document.oncontextmenu = () => {
//   return false
// }
// // 禁用拖拽
// document.addEventListener('drop', firbitFn, false)
// document.addEventListener('dragover', firbitFn, false)
</script>

<style lang="stylus">
@import './assets/css/app.styl'
</style>
