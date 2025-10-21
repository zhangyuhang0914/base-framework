<template lang="pug">
.pageWrapper
  vanImage(width="100%" height="auto" :src="getImage('home.headerBoolean')" fit="contain")
  .container
    ItemCard(title="政务服务")
    ItemCard(title="公共服务")
    ItemCard(title="便民查询" showMore)
    ItemCard(title="办事服务" showMore)
    ItemCard(title="办事网点" showMore)
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { countDisplay } from '@/api/helper/common'
import { getImage } from '@/constants/images'
import ItemCard from '@/pages/home/components/itemCard/index.vue'

export default defineComponent({
  name: 'Home',
  components: {
    ItemCard
  },
  setup() {
    // 获取统计数据
    const getCountDisplay = () => {
      countDisplay().then(res => {
        console.log('getCountDisplay', res)
      })
    }
    onMounted(() => {
      // 调用鄂汇办SDK组件
      ehbAppJssdk.notice.showPreloader({
        text: '使劲加载中..'
      })
      setTimeout(() => {
        ehbAppJssdk.notice.hidePreloader()
      }, 1500)
      // 获取统计数据
      getCountDisplay()
    })
    return {
      getImage
    }
  }
})
</script>

<style lang="scss" scoped>
.pageWrapper {
  background: #eef5ff;
  .container {
    padding: 0 12px;
  }
}
</style>
