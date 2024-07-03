<template lang="pug">
.custom-tab-bar#customTabBar(v-if="showTabBar")
  u-tabbar(
    :value="tabBar.selectName"
    @change="onChange"
    :fixed="true"
    :placeholder="true"
    :safeAreaInsetBottom="true"
    activeColor="#479AFD"
    inactiveColor="#ABA9AA"
  )
    u-tabbar-item(
      v-for="(item, index) in tabBar.list"
      :key="index"
      :text="item.text"
      :name="item.text"
    )
      template(#active-icon)
        i.iconfont.active-icon(:class="item.selectedIconPath")
      template(#inactive-icon)
        i.iconfont.default-icon(:class="item.iconPath")
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance } from 'vue'
import { userCommonStoreHook } from '@/store/modules/common'
import { onLoad, onReady } from '@dcloudio/uni-app'
export default defineComponent({
  name: 'CustomTabBar',
  props: {
    showTabBar: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const commonHook = userCommonStoreHook()
    const tabBar = computed(() => commonHook.tabBar)
    // methods
    const onChange = (name: string) => {
      let nameArr = ['首页', '金融产品', '政策新闻', '我的']
      commonHook.setTabBar(nameArr.indexOf(name), name, props.showTabBar)
    }
    onLoad(() => {
      // 隐藏原生tab栏
      uni.hideTabBar()
    })
    onReady(() => {
      const query = uni.createSelectorQuery().in(getCurrentInstance())
      setTimeout(() => {
        query
          .select('#customTabBar')
          .boundingClientRect((data: UniApp.NodeInfo | UniApp.NodeInfo[]) => {
            // 底部tabbar高度
            // @ts-ignore
            data && data.height && commonHook.setTabBarHeight(data.height)
          })
          .exec()
      }, 400)
    })
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
