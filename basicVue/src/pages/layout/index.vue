<template>
  <div class="appPage">
    <LayoutHeader />
    <div class="layoutContainer">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <keep-alive :include="cachedRoute">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
    <LayoutFooter />
  </div>
</template>

<script lang="ts">
import LayoutHeader from '@/pages/layout/header/index.vue'
import LayoutFooter from '@/pages/layout/footer/index.vue'
import { defineComponent } from 'vue'
import { computed } from 'vue'
import { useGlobalStoreHook } from '@/store/modules/global'
export default defineComponent({
  name: 'Layout',
  components: {
    LayoutHeader,
    LayoutFooter
  },
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  .layoutContainer {
    position: relative;
    flex: 1;
  }
}
</style>
