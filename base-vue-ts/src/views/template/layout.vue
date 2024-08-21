<template lang="pug">
ElConfigProvider(:locale="configProvider.zhCn" :size="configProvider.size" :message="configProvider.message")
  .page-wrap
    LayoutHeader
    .system-container
      .c-content-box
        router-view(v-slot="{ Component }")
          transition(name="fade" mode="out-in")
            keep-alive(:include="cachedRoute")
              component(:is="Component" :key="route.name")
    LayoutFooter
</template>

<script lang="ts">
import { defineComponent, computed, watch, shallowReactive } from 'vue'
import LayoutHeader from '@/views/template/components/layout-header/index.vue'
import LayoutFooter from '@/views/template/components/layout-footer/index.vue'
import { userCommonStoreHook } from '@/stores/modules/common'
import { useRoute } from 'vue-router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

export default defineComponent({
  name: 'Layout',
  components: { LayoutHeader, LayoutFooter },
  setup(props) {
    const commonStore = userCommonStoreHook()
    const route = useRoute()
    const configProvider = shallowReactive({
      zhCn: zhCn,
      size: 'large',
      message: 5
    })
    const cachedRoute = computed(() => {
      return commonStore?.cachedRoute ?? []
    })
    watch(
      () => route.fullPath,
      () => {
        const routeName: any = route.name ?? ''
        // 缓存的路由
        if (route.meta.keepAlive) {
          commonStore.setCached(routeName)
        }
      },
      {
        immediate: true
      }
    )
    return {
      route,
      cachedRoute,
      configProvider
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
