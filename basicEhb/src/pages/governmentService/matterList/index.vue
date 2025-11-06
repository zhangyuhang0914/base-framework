<template lang="pug">
.pageWrapper
  VanImage(width="100%" height="auto" :src="getImage('governmentService.matterBanner')" fit="contain")
  .pageContent
    ScrollList(
      ref="scrollerRef"
      :pullDown="pullDown"
      :pullUp="pullUp"
      :pullUpFinish="pullUpFinish"
      @refresh="handleRefresh"
      @onLoad="handleLoadMore"
    )
      template(#list)
        .listContentWrapper(v-if="matterList.length")
          .listItemCard(
            v-for="(item, index) in matterList"
            :key="item.id + '_' + index"
          )
            .topCard
              VanImage.iconWrapper(width="42" height="auto" :src="item.icon" fit="contain")
              .cardTitle {{ item.name }}
            .bottomCard
              .scopeApplication {{ '服务适用范围：湖北省' }}
              .cardRightMore(@click="handleItemClick(item)")
                span {{ '查看详情' }}
                ChevronRight(:size="22")
        NoData(v-if="matterList.length === 0 && !pullUp")
  RegionSelect(ref="regionSelectRef")
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import ScrollList from '@/components/scrollList/index.vue'
import NoData from '@/components/noData/index.vue'
import RegionSelect from '@/components/regionSelect/index.vue'
import { ChevronRight } from 'lucide-vue-next'
import { getImage } from '@/constants/images'
import type { PageType } from '@/common/interface/http'

export default defineComponent({
  name: 'MatterList',
  components: {
    ScrollList,
    NoData,
    RegionSelect,
    ChevronRight
  },
  setup() {
    const scrollerRef = ref()
    // 下拉加载状态
    const pullDown = ref(false)
    // 上划懒加载loading状态
    const pullUp = ref(false)
    // 是否已加载完成，加载完成后不再触发 load 事件
    const pullUpFinish = ref(false)
    const matterList = ref<any>([])
    const page = reactive<PageType>({
      currentPage: 1,
      pageSize: 5,
      total: 20
    })
    const regionSelectRef = ref()
    // 模拟数据源
    const allMockData = ref<any[]>([])
    // 初始化模拟数据
    const initMockData = () => {
      allMockData.value = [
        {
          id: 1,
          name: '广播电视节目制作经营许可证查询',
          icon: getImage('governmentService.iconProgramProductionLicenseQuery'),
          type: 'service',
          serviceId: '102780'
        },
        {
          id: 2,
          name: '接收卫星传送的境外电视节目许可证查询',
          icon: getImage('governmentService.iconSatelliteProgramsLicenseQuery'),
          type: 'service',
          serviceId: '102800'
        }
      ]
    }
    // 初始化数据
    const initData = () => {
      page.currentPage = 1
      pullUpFinish.value = false
      initMockData()
      getList()
      nextTick(() => {
        if (scrollerRef.value && scrollerRef.value.vanScrollBox) {
          scrollerRef.value.vanScrollBox.scrollTop = 0
        }
      })
    }
    // 获取列表
    const getList = () => {
      // 下拉刷新时，根据下拉状态判断是否开启上拉加载状态
      pullUp.value = pullDown.value ? false : true
      setTimeout(() => {
        try {
          // 计算当前页的数据范围
          const startIndex = (page.currentPage - 1) * page.pageSize
          const endIndex = startIndex + page.pageSize
          // 获取当前页的数据
          const currentPageData = allMockData.value.slice(startIndex, endIndex)
          // console.log(`第${page.currentPage}页数据:`, {
          //   startIndex,
          //   endIndex,
          //   dataLength: currentPageData.length,
          //   totalData: allMockData.value.length
          // })
          if (pullDown.value) {
            // 下拉刷新：重置数据
            matterList.value = currentPageData
            pullDown.value = false
          } else {
            // 上拉加载：追加数据
            matterList.value = [...matterList.value, ...currentPageData]
            pullUp.value = false
          }
          // 判断是否还有更多数据
          const hasMoreData = endIndex < allMockData.value.length
          pullUpFinish.value = !hasMoreData
          nextTick(() => {
            scrollerRef.value && scrollerRef.value.checkPosition()
          })
          // console.log('分页状态:', {
          //   currentPage: page.currentPage,
          //   pageSize: page.pageSize,
          //   currentDataLength: matterList.value.length,
          //   totalData: allMockData.value.length,
          //   hasMoreData,
          //   pullUpFinish: pullUpFinish.value
          // })
        } catch (error) {
          pullDown.value = false
          pullUp.value = false
        }
      }, 1000)
    }
    // 刷新
    const handleRefresh = () => {
      pullDown.value = true
      pullUpFinish.value = false
      page.currentPage = 1
      getList()
    }
    // 加载更多
    const handleLoadMore = () => {
      // 已加载所完有数据
      if (pullUpFinish.value) return
      page.currentPage++
      getList()
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
    }
    onMounted(() => {
      initData()
    })
    return {
      scrollerRef,
      regionSelectRef,
      pullDown,
      pullUp,
      pullUpFinish,
      matterList,
      getImage,
      handleRefresh,
      handleLoadMore,
      handleItemClick
    }
  }
})
</script>

<style lang="scss" scoped>
.pageWrapper {
  flex: 1;
  height: 100%;
  overflow: hidden;
  background: $backgroundInfo;
  overflow: hidden;
  @include flexColumn;
  .pageContent {
    flex: 1;
    margin-top: -20px;
    @include flexColumn;
    background: linear-gradient(90deg, #fafafa, #ffffff);
    border-radius: $borderRadius24 $borderRadius24 0 0;
    gap: $gap36;
    z-index: 9;
    overflow-x: hidden;
    overflow-y: auto;
    .listContentWrapper {
      padding: 0 calc(var(--van-padding-sm) + 12px) 0 calc(var(--van-padding-sm) + 12px);
      .listItemCard {
        padding: 26px 30px;
        margin: 0 0 24px 0;
        background: linear-gradient(180deg, #dfecfb, #ffffff);
        border: 1px solid $borderListColor;
        border-radius: $borderRadius20;
        box-shadow: 0 3px 10px 0 #1932641a;
        .topCard {
          padding: 0 0 20px 0;
          @include flexAlignCenter;
          border-bottom: 1px solid $borderListDividerColor;
          .cardTitle {
            padding: 0 0 0 24px;
            color: $colorDefault;
            font-weight: 700;
            font-size: $fontSize32;
            line-height: $lineHeight46;
          }
        }
        .bottomCard {
          padding: 20px 0 0 0;
          @include flexBetween;
          .scopeApplication {
            color: #b4babf;
            font-size: $fontSize24;
          }
          .cardRightMore {
            @include flexCenter;
            color: $colorLink;
            font-size: $fontSize28;
            font-weight: 700;
          }
        }
      }
    }
  }
}
</style>
