<template lang="pug">
.page-wrap
  .system-container
    .menu-box(:class="{ 'collapsed-sidebar': !isExpanded }" @click="isExpanded = !isExpanded")
      div {{ 'mic-pc-home' }}
      div {{ '我是子应用侧边栏' }}
    .c-content-box
      router-view(v-slot="{ Component }")
        transition(name="fade" mode="out-in")
          keep-alive(:include="cachedRoute")
            component(:is="Component" :key="route.name")
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue'
import { userCommonStoreHook } from '@/stores/modules/common'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'Layout',
  setup(props) {
    const commonHook = userCommonStoreHook()
    const route = useRoute()
    const isExpanded = ref(true)
    const cachedRoute = computed(() => {
      return commonHook?.cachedRoute ?? []
    })
    watch(
      () => route.fullPath,
      () => {
        const routeName: any = route.name ?? ''
        // 缓存的路由
        if (route.meta.keepAlive) {
          commonHook.setCached(routeName)
        }
      },
      {
        immediate: true
      }
    )
    return {
      route,
      isExpanded,
      cachedRoute
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
