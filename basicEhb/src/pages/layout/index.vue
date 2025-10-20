<template lang="pug">
  VanConfigProvider(:theme-vars="themeVars" theme-vars-scope="global")
    router-view(v-slot="{ Component }")
      transition(name="fade" mode="out-in")
        keep-alive(:include="cachedRoute")
          component(:is="Component")
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { computed } from 'vue'
import { useGlobalStoreHook } from '@/store/modules/global'
import type { ConfigProviderThemeVars } from 'vant'
export default defineComponent({
  name: 'Layout',
  setup() {
    const globalStore = useGlobalStoreHook()
    const cachedRoute = computed(() => {
      return globalStore?.cachedRoute ?? []
    })
    // 配置vant主题
    const themeVars: ConfigProviderThemeVars = reactive({})
    return {
      cachedRoute,
      themeVars
    }
  }
})
</script>

<style lang="scss" scoped>
.appPage {
  width: 100%;
  min-height: 100vh;
}
</style>
