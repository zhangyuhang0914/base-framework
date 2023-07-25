<template lang="pug">
.home-page-wrap
  .service-block.c-scroll-block
    .c-title {{ '服务专区' }}
    .scroll-item-list
      .c-item-service(v-for="(item, index) in serviceList" :key="index" @click="handleService(item)")
        img(:src="`${BASE_URL}${item.imgUrl}.png`")
        span {{ item.name }}
  .handle-matter-block.c-scroll-block
    .c-title {{ '事项办理专区' }}
    .scroll-item-list
      .c-item-service(v-for="(item, index) in itemList" :key="index" @click="handleItem(item)")
        img(:src="`${BASE_URL}${item.imgUrl}.png`")
        span {{ item.name }}
</template>

<script>
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: 'HomePage',
  setup() {
    const BASE_URL = import.meta.env.BASE_URL
    const router = useRouter()
    const serviceList = reactive([
      {
        id: 0,
        name: '办件查询',
        imgUrl: 'images/home/handle-select'
      },
      {
        id: 1,
        name: '证照下载',
        imgUrl: 'images/home/handle-document-download'
      },
      {
        id: 2,
        name: '自助办理',
        imgUrl: 'images/home/handle-self'
      },
      {
        id: 3,
        name: '办事预约',
        imgUrl: 'images/home/handle-reservation'
      }
    ])
    const itemList = reactive([
      {
        id: 0,
        name: '交通建设',
        imgUrl: 'images/home/handle-traffic-build'
      },
      {
        id: 1,
        name: '道路运输',
        imgUrl: 'images/home/handle-traffic'
      },
      {
        id: 2,
        name: '港航海事',
        imgUrl: 'images/home/handle-shipping'
      },
      {
        id: 3,
        name: '公路管理',
        imgUrl: 'images/home/handle-road-manager'
      }
    ])
    const handleService = item => {
      // 暂时写死
      router.push({
        name: item.itemUrl || 'DocumentInquiry'
      })
    }
    const handleItem = item => {
      // 暂时写死
      router.push({
        name: item.itemUrl || 'ItemSelection',
        query: {
          title: item.title || '',
          itemId: item.itemId || ''
        }
      })
    }
    onMounted(() => {})
    return {
      BASE_URL,
      serviceList,
      itemList,
      handleService,
      handleItem
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
