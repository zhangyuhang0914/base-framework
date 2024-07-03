<template lang="pug">
.layout-wrap
  .layout-top
    //- LayoutHeader
  .layout-bottom.no-drag
    .layout-left
      //- 菜单
      //- LayoutMenu
    .layout-right.no-drag
      .network(v-if="!online") {{ $t('网络连接已断开!') }}
      router-view(v-slot="{ Component }")
        transition(name="fade",mode="out-in")
          keep-alive(:include="cachedRoute")
            component(:is="Component")
</template>
<script>
import { defineComponent, onUnmounted, ref } from 'vue'
export default defineComponent({
  name: 'Layout',
  setup() {
    const online = ref(true)
    onUnmounted(() => {
      console.log('111')
    })
    return {
      online
    }
  }
})
</script>
<style lang="stylus" scoped>
@import './index.styl'
</style>
