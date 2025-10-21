<template lang="pug">
VanConfigProvider(:theme-vars="themeVars" theme-vars-scope="global")
  .templatePage
    router-view(v-slot="{ Component }")
      transition(name="fade" mode="out-in")
        keep-alive(:include="cachedRoute")
          component(:is="Component")
    CommonFooter
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue'
import CommonFooter from '@/pages/layout/components/footer.vue'
import { useGlobalStoreHook } from '@/store/modules/global'
import type { ConfigProviderThemeVars } from 'vant'
export default defineComponent({
  name: 'Layout',
  components: {
    CommonFooter
  },
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
.van-config-provider {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  .templatePage {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    // 如果希望子页面自动撑开，可以去掉这个flex布局
    // 或者保持这样，让footer始终在底部
  }
}
</style>
