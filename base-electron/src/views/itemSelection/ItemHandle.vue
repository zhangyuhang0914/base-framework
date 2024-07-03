<script setup>
import stepProcess from './steps/StepProcess.vue'
const route = useRoute()
let itemId = route.query.itemId
</script>
<template>
  <stepProcess :itemId='itemId'></stepProcess>
</template>
<style scoped lang='stylus'>
</style>
