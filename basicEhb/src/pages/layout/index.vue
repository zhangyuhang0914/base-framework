<template lang="pug">
  router-view(v-slot="{ Component }")
    transition(name="fade" mode="out-in")
      keep-alive(:include="cachedRoute")
        component(:is="Component")
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { computed } from 'vue'
import { useGlobalStoreHook } from '@/store/modules/global'
export default defineComponent({
  name: 'Layout',
  setup() {
    const globalStore = useGlobalStoreHook()
    const cachedRoute = computed(() => {
      return globalStore?.cachedRoute ?? []
    })
    return {
      cachedRoute
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
