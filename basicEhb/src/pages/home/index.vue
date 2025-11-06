<template lang="pug">
.pageWrapper
  VanImage(width="100%" height="auto" :src="getImage('home.headerBoolean')" fit="contain")
  .container
    ItemCard.governmentServiceCard(title="政务服务")
      template(#content)
        .matterItem(v-for="(item, index) in governmentServiceList" :key="index" @click="handleRouterLink(item.link)")
          VanImage(width="72" height="auto" :src="item.icon" fit="contain")
          span {{ item.label }}
    ItemCard.commonServiceCard(title="公共服务")
      template(#content)
        .otherContent
          .otherItem.w-100(v-for="(item, index) in otherServiceList" :key="index" :style="{ color: item.textColor }" @click="handleRouterLink(item.link)")
            VanImage(width="100%" height="auto" :src="item.icon" fit="contain")
            span.text {{ item.label }}
        .commonContent
          .commonItem(v-for="(item, index) in commonServiceList" :key="index" @click="handleRouterLink(item.link)")
            VanImage(width="45" height="45" :src="item.icon" fit="contain")
            span.text {{ item.label }}
    ItemCard.transactServiceCard(title="便民查询" showMore @more="handleMore('matter')")
      template(#content)
        .content(v-if="matterList.length")
          VanCell(v-for="(item, index) in matterList" :key="index" inset center @click="handleItemClick(item)")
            template(#icon)
              VanImage(width="36" height="auto" :src="getImage('common.iconMatter')" fit="contain")
            template(#title)
              span.text {{ item.name }}
        NoData(v-else showText) 
    ItemCard.transactServiceCard(title="办事服务" showMore @more="handleMore('service')")
      template(#content)
        .content(v-if="serviceList.length")
          VanCell(v-for="(item, index) in serviceList" :key="index" inset center @click="handleItemClick(item)")
            template(#icon)
              VanImage(width="36" height="auto" :src="getImage('common.iconService')" fit="contain")
            template(#title)
              span.text {{ item.name }}
        NoData(v-else showText) 
    ItemCard.tMapCard(title="办事网点" showMore @more="handleMore('outlets')")
      template(#content)
        TMap(height="286px" showSearch shape="round")
  CommonFooter
  RegionSelect(ref="regionSelectRef")
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { getImage } from '@/constants/images'
import ItemCard from '@/pages/home/components/itemCard/index.vue'
import TMap from '@/components/map/index.vue'
import NoData from '@/components/noData/index.vue'
import CommonFooter from '@/pages/layout/components/footer.vue'
import RegionSelect from '@/components/regionSelect/index.vue'
import { useRouter } from 'vue-router'
import { itemInfosEhbList } from '@/api/helper/commonService'

type ModulesType = 'matter' | 'service'
export default defineComponent({
  name: 'Home',
  components: {
    NoData,
    ItemCard,
    TMap,
    CommonFooter,
    RegionSelect
  },
  setup() {
    const router = useRouter()
    const regionSelectRef = ref()
    // 政务服务数据源
    const governmentServiceList = reactive([
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
    // 公共服务数据源
    const otherServiceList = reactive([
      {
        textColor: '#1759b5',
        label: '标准化建设',
        icon: getImage('home.iconStandardization'),
        link: '/commonService/standardization'
      },
      {
        textColor: '#5b43ac',
        label: '智慧广电乡村工程',
        icon: getImage('home.iconGovernmentService'),
        link: '/commonService/governmentServicePage'
      }
    ])
    const commonServiceList = reactive([
      {
        label: '办事网点',
        icon: getImage('home.iconOutlets'),
        link: '/commonService/serviceOutlets'
      },
      {
        label: '常见故障',
        icon: getImage('home.iconFaults'),
        link: '/commonService/faultsList'
      },
      {
        label: '我要报修',
        icon: getImage('home.iconMaintenance'),
        link: '/commonService/maintenanceApply'
      }
    ])
    // 便民查询数据源
    const matterList: any = ref([])
    // 办事服务数据源
    const serviceList: any = ref([])
    // 办事服务数据源
    const getMatterList = () => {
      matterList.value = [
        {
          id: 1,
          name: '广播电视节目制作经营许可证查询',
          type: 'service',
          serviceId: '102780'
        },
        {
          id: 2,
          name: '接收卫星传送的境外电视节目许可证查询',
          type: 'service',
          serviceId: '102800'
        }
      ]
    }
    // 获取便民查询数据
    const getServiceList = () => {
      const params = {
        page: 1,
        limit: 3,
        sidx: 'NUM',
        order: 'desc'
      }
      itemInfosEhbList(params).then(result => {
        const resultData = result.data.list || []
        serviceList.value = resultData
      })
    }
    const handleMore = (type: ModulesType) => {
      const modulesMap = {
        matter: '/governmentService/matterList',
        service: '/governmentService/serviceList',
        outlets: '/commonService/serviceOutlets'
      }
      if (!modulesMap[type]) return
      router.push({
        path: modulesMap[type]
      })
    }
    const handleRouterLink = (link: string) => {
      router.push({
        path: link
      })
    }
    // 处理事项/服务
    const handleItemClick = (item: any) => {
      if (item.type === 'service') {
        const params = {
          id: item.serviceId
        }
        ehbAppJssdk.operateWindow.openService(params)
      } else {
        regionSelectRef.value && regionSelectRef.value?.openActiveSheet(item)
      }
      // console.log('handleItemClick:', item)
    }
    onMounted(() => {
      // 获取便民查询数据
      getMatterList()
      // 获取办事服务数据
      getServiceList()
    })
    return {
      regionSelectRef,
      governmentServiceList,
      otherServiceList,
      commonServiceList,
      matterList,
      serviceList,
      getImage,
      handleMore,
      handleRouterLink,
      handleItemClick
    }
  }
})
</script>

<style lang="scss" scoped>
.pageWrapper {
  background: $backgroundInfo;
  .container {
    padding: 0 30px 30px 30px;
    margin-top: -88px;
    @include flexColumn;
    gap: $gap30;
    .governmentServiceCard {
      :deep(.cardBody) {
        padding: 36px 42px;
        display: flex;
        .matterItem {
          flex: 1;
          @include flexColumnCenter;
        }
      }
    }
    .commonServiceCard {
      :deep(.cardBody) {
        @include flexColumn;
        .otherContent {
          padding: 20px 24px 0 24px;
          @include flexBetween;
          gap: $gap20;
          .otherItem {
            position: relative;
            .text {
              position: absolute;
              top: 28px;
              left: 50%;
              transform: translateX(-50%);
              font-size: $fontSize30;
              font-weight: 700;
              @include textNowrap;
            }
          }
        }
        .commonContent {
          padding: 36px 42px;
          display: flex;
          .commonItem {
            flex: 1;
            @include flexColumnCenter;
            .text {
              padding-top: 12px;
              font-size: $fontSize32;
            }
          }
        }
      }
    }
    .transactServiceCard {
      :deep(.cardBody) {
        padding: 10px 0;
        .van-cell {
          padding: 34px 28px;
          .van-cell__title {
            padding-left: 24px;
            .text {
              font-size: $fontSize30;
              font-weight: 600;
              line-height: $lineHeight36;
            }
          }
        }
      }
    }
    .tMapCard {
      :deep(.cardBody) {
        padding: 18px;
      }
    }
  }
}
</style>
