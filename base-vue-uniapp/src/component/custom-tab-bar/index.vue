<template lang="pug">
.custom-tab-bar
  u-tabbar(
    :value="tabBar.selectIndex"
    @change="onChange"
    :fixed="true"
    :placeholder="true"
    :safeAreaInsetBottom="true"
  )
    u-tabbar-item(
      v-for="(item, index) in tabBar.list"
      :text="item.text"
      :icon="tabBar.selectIndex === index ? item.selectedIconPath : item.iconPath"
      :name="item.text"
    )
</template>

<script>
import { defineComponent } from 'vue'
import { userCommonStore } from '@/stores/modules/common'
export default defineComponent ({
  name: 'CustomTabBar',
  props: {
    showTabBar: {
      type: Boolean,
      default: true
    }
  },
  setup (prop, context) {
    const userCommonStoreHook = userCommonStore()
    const tabBar = userCommonStoreHook.tabBar
    console.log('tabBar', tabBar, context, prop)
    // methods
    const onChange = (index) => {
      console.log('onChange', index)
      userCommonStoreHook.setTabBar(index, prop.showTabBar)
    }
    return {
      tabBar,
      onChange
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
