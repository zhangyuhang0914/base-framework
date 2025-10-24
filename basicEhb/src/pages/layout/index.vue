<template lang="pug">
VanConfigProvider(:theme-vars="themeVars" theme-vars-scope="global")
  .templatePage
    router-view(v-slot="{ Component }")
      transition(name="fade" mode="out-in")
        keep-alive(:include="cachedRoute")
          component(:is="Component")
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch } from 'vue'
import { useGlobalStoreHook } from '@/store/modules/global'
import type { ConfigProviderThemeVars } from 'vant'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'Layout',
  setup() {
    const route = useRoute()
    const globalStore = useGlobalStoreHook()
    const cachedRoute = computed(() => {
      return globalStore?.cachedRoute ?? []
    })
    watch(
      () => route.fullPath,
      () => {
        const routeName: any = route.name ?? ''
        // 缓存的路由
        if (route.meta.keepAlive) {
          globalStore.setCached(routeName)
        }
      },
      {
        immediate: true
      }
    )
    // 配置vant主题
    const themeVars: ConfigProviderThemeVars = reactive({
      // 搜索组件
      searchInputHeight: '40px',
      searchContentBackground: '#FFFFFF',
      // 下拉刷新组件
      pullRefreshHeadTextColor: '#0833B4',
      // 列表组件
      listTextColor: '#0833B4'
    })
    return {
      cachedRoute,
      themeVars
    }
  }
})
</script>

<style lang="scss" scoped>
.van-config-provider {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .templatePage {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
