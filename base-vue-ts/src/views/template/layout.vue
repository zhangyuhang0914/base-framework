<template lang="pug">
.page-wrap
  LayoutHeader
  .system-container
    .c-content-box
      router-view(v-slot="{ Component }")
        transition(name="fade" mode="out-in")
          keep-alive(:include="cachedRoute")
            component(:is="Component" :key="route.name")
  .system-footer
    span {{ '我是底部' }}
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import LayoutHeader from '@/views/template/components/layout-header/index.vue'
import { userCommonStoreHook } from '@/stores/modules/common'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'Layout',
  components: { LayoutHeader },
  setup(props) {
    const commonHook = userCommonStoreHook()
    const route = useRoute()
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
      cachedRoute
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
