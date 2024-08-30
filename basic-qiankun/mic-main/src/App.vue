<template lang="pug">
.page-wrap
  router-view(v-if="jumpMicMain" v-slot="{ Component }")
    transition(name="fade" mode="out-in")
      keep-alive(:include="cachedRoute")
        component(:is="Component" :key="route.name")
  .system-header
    span {{ '主应用系统' }}
    CSelect(
      @change="selectChange"
    )
  .wrapper(v-if="!jumpMicMain")
    #frameSection
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, onMounted, onUnmounted } from 'vue'
import { storageLocal } from '@/utils/storage'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { userCommonStoreHook } from '@/stores/modules/common'
import CSelect from '@/components/c-select/index.vue'
export default defineComponent({
  name: 'App',
  components: { CSelect },
  setup() {
    useI18n().locale.value = storageLocal.getItem('responsive-locale')?.locale ?? 'zh_CN'
    const commonHook = userCommonStoreHook()
    const route = useRoute()
    const router = useRouter()
    const cachedRoute = computed(() => {
      return commonHook?.cachedRoute ?? []
    })
    const jumpMicMain = ref(true)
    const selectChange = (val: any) => {
      if (val === 'mic-pc-dispatch') {
        router.push('/mic-pc-dispatch/about')
      } else {
        router.push('/mic-pc-home/about/home')
      }
      console.log('selectChange', val)
    }
    onMounted(() => {
      // console.log('onMounted：App.vue')
    })
    /**
     * 监听路由变化
     * 1.缓存keep-alive路由
     * 2.判断是否是跳转到子应用
     */
    watch(
      () => route.fullPath,
      () => {
        const routeName: any = route.name ?? ''
        // 缓存的路由
        if (route.meta.keepAlive) {
          commonHook.setCached(routeName)
        }
        // 判断是否是跳转到子应用
        jumpMicMain.value = route.path.match('/mic') ? false : true
      },
      {
        immediate: true
      }
    )
    const updateOnline = () => {
      const onlineState = !!navigator.onLine
      commonHook.setOnlineState(onlineState)
    }
    onMounted(() => {
      // 监听网络变化
      window.addEventListener('online', updateOnline)
      window.addEventListener('offline', updateOnline)
    })
    onUnmounted(() => {
      window.removeEventListener('online', updateOnline)
      window.removeEventListener('offline', updateOnline)
    })
    return {
      route,
      router,
      cachedRoute,
      jumpMicMain,
      selectChange
    }
  }
})
</script>
<style lang="stylus">
@import './assets/css/app.styl'
</style>
