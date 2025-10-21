<template lang="pug">
.pageWrapper
  vanImage(width="100%" height="auto" :src="getImage('home.headerBoolean')" fit="contain")
  .container
    ItemCard.governmentServiceCard(title="政务服务")
      template(#content)
        .matterItem(v-for="(item, index) in governmentServiceData" :key="index" @click="handleRouter(item.link)")
          vanImage(width="72" height="auto" :src="item.icon" fit="contain")
          span {{ item.label }}
    ItemCard(title="公共服务")
    ItemCard(title="便民查询" showMore @more="handleMore('1')")
    ItemCard(title="办事服务" showMore @more="handleMore('2')")
    ItemCard(title="办事网点" showMore @more="handleMore('3')")
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'
import { getImage } from '@/constants/images'
import ItemCard from '@/pages/home/components/itemCard/index.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Home',
  components: {
    ItemCard
  },
  setup() {
    const router = useRouter()
    // 政务服务数据源
    const governmentServiceData = reactive([
      {
        label: '便民查询',
        icon: getImage('home.iconConvenientQuery'),
        link: '/governmentService/matterList'
      },
      {
        label: '办事服务',
        icon: getImage('home.iconService'),
        link: '/governmentService/serviceList'
      },
      {
        label: '常见问题',
        icon: getImage('home.iconQuestion'),
        link: '/governmentService/questionList'
      }
    ])
    const handleMore = (id: string) => {
      console.log('handleMore', id)
    }
    const handleRouter = (link: string) => {
      console.log('handleRouter', link)
      router.push({
        path: link
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
    })
    return {
      governmentServiceData,
      getImage,
      handleMore,
      handleRouter
    }
  }
})
</script>

<style lang="scss" scoped>
.pageWrapper {
  background: #eef5ff;
  .container {
    padding: 0 30px;
    @include flex-column;
    gap: $gap30;
    .governmentServiceCard {
      :deep(.cardBody) {
        padding: 36px 42px;
        display: flex;
        .matterItem {
          flex: 1;
          @include flex-column-center;
        }
      }
    }
  }
}
</style>
