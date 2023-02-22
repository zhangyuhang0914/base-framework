<template lang="pug">
div
  a(href="https://vitejs.dev" target="_blank")
    img( src="/vite.svg" class="logo" alt="Vite logo")
  a(href="https://vitejs.org/" target="_blank")
    img( src="./assets/vue.svg" class="logo vue" alt="Vue logo")
  HelloWorld(msg="Vite + Vue")
</template>

<script setup lang="ts">
import { storageLocal } from "@/utils/storage"
import { useI18n } from "vue-i18n"
import { onMounted } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { userCommonStoreHook } from '@/stores/modules/common'
useI18n().locale.value = storageLocal.getItem("responsive-locale")?.locale ?? 'zh_CN'
const userInfo = {
  name: 'zhangyuhang',
  phone: '17607158394'
}
console.log('11111111', userInfo)
onMounted(() => {
  userCommonStoreHook().setUserBaseInfo(userInfo)
})
</script>
<style lang="stylus" scoped>
.logo
  height 6em
  padding 1.5em
  will-change filter
  transition filter 300ms
.logo:hover
  filter drop-shadow(0 0 2em #646cffaa)

.logo.vue:hover
  filter drop-shadow(0 0 2em #42b883aa)
</style>
<style lang="stylus">
@import './assets/css/app.styl'
</style>
