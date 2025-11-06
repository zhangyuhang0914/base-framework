<template lang="pug">
.pageWrapper
  .pageHeader
    SearchInput(showSearchIcon)
    HotSearch
  .pageContent
    ScrollList(
      ref="scrollerRef"
      :isPullUp="true"
      :pullDown="pullDown"
      :pullUp="pullUp"    
      :pullUpFinish="pullUpFinish"
      @refresh="handleRefresh"
      @onLoad="handleLoadMore"
    )
      template(#list)
        .listContentWrapper(v-if="faultsList.length")
          .listItemCard(
            v-for="(item, index) in faultsList"
            :key="item.id + '_' + index"
            @click="handleItemClick(item)"
          )
            VanCell(inset center)
              template(#title)
                span.cardTitle {{ item.title }}
              //- template(#label)
              //-   span.cardDescribe {{ item.describe }}
              template(#right-icon)
                .cardIcon
                  ChevronRight(:size="20")
        NoData(v-if="faultsList.length === 0 && !pullUp") 
          VanImage(width="50%" height="auto" :src="getImage('common.noData')" fit="contain")
  RegionSelect(ref="regionSelectRef")
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import SearchInput from '@/components/searchInput/index.vue'
import HotSearch from '@/pages/governmentService/components/hotSearch/index.vue'
import ScrollList from '@/components/scrollList/index.vue'
import NoData from '@/components/noData/index.vue' // 统一导入 NoData 组件
import { ChevronRight } from 'lucide-vue-next'
import type { PageType } from '@/common/interface/http'
import { getImage } from '@/constants/images'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'FaultsList',
  components: {
    SearchInput,
    HotSearch,
    ScrollList,
    NoData, // 注册 NoData 组件
    ChevronRight
  },
  setup() {
    const router = useRouter()
    const scrollerRef = ref()
    // 下拉加载状态
    const pullDown = ref(false)
    // 上划懒加载loading状态
    const pullUp = ref(false)
    // 是否已加载完成，加载完成后不再触发 load 事件
    const pullUpFinish = ref(false)
    const faultsList = ref<any[]>([])
    const page = reactive<PageType>({
      currentPage: 1,
      pageSize: 6,
      total: 0
    })
    const regionSelectRef = ref()
    // 初始化模拟数据源
    const allMockData = ref<any[]>([])
    // 初始化模拟数据
    const initMockData = () => {
      const baseData: any[] = [
        {
          id: 1,
          title: '若出现“没有授权”或“未购买此节目”电视画面提示“没有授权”或“未购买此节目”',
          describe:
            '电视画面提示“没有授权”或“未购买此节目”电视画面提示“没有授权”或“未购买此节目”电视画面提示“没有授权”或“未购买此节目”'
        },
        {
          id: 2,
          title: '若出现“没有授权”或“未购买此节目”电视画面提示“没有授权”或“未购买此节目”',
          describe:
            '电视画面提示“没有授权”或“未购买此节目”电视画面提示“没有授权”或“未购买此节目”电视画面提示“没有授权”或“未购买此节目”'
        },
        {
          id: 3,
          title: '若出现“没有授权”或“未购买此节目”电视画面提示“没有授权”或“未购买此节目”',
          describe:
            '电视画面提示“没有授权”或“未购买此节目”电视画面提示“没有授权”或“未购买此节目”电视画面提示“没有授权”或“未购买此节目”'
        }
      ]
      // 生成动态模拟数据
      const dynamicData: any[] = Array.from({ length: 15 }, (_, index) => ({
        id: index + 4,
        title: `常见故障 ${index + 4}`,
        describe: `这是第 ${index + 4} 个常见故障的详细描述`
      }))
      allMockData.value = [...baseData, ...dynamicData]
      page.total = allMockData.value.length // 同步总数据量
    }
    // 初始化数据
    const initData = () => {
      page.currentPage = 1
      pullUpFinish.value = false
      // 初始化模拟数据
      initMockData()
      getList()
      nextTick(() => {
        // 重置滚动位置
        if (scrollerRef.value && scrollerRef.value.vanScrollBox) {
          scrollerRef.value.vanScrollBox.scrollTop = 0
        }
      })
    }
    // 获取列表数据
    const getList = () => {
      // 下拉刷新时，根据下拉状态判断是否开启上拉加载状态
      pullUp.value = pullDown.value ? false : true
      setTimeout(() => {
        try {
          // 计算当前页数据范围
          const startIndex = (page.currentPage - 1) * page.pageSize
          const endIndex = startIndex + page.pageSize
          // 获取当前页数据
          const currentPageData = allMockData.value.slice(startIndex, endIndex)
          // console.log(`第${page.currentPage}页数据:`, {
          //   startIndex,
          //   endIndex,
          //   dataLength: currentPageData.length,
          //   totalData: allMockData.value.length
          // })
          if (pullDown.value) {
            // 下拉刷新：重置数据
            faultsList.value = currentPageData
            // 重置下拉刷新状态
            pullDown.value = false
            nextTick(() => {
              scrollerRef.value && scrollerRef.value.checkPosition()
            })
          } else {
            // 上拉加载：追加数据
            faultsList.value = [...faultsList.value, ...currentPageData]
            // 重置上拉加载状态
            pullUp.value = false
          }
          // 判断是否还有更多数据
          const hasMoreData = endIndex < allMockData.value.length
          pullUpFinish.value = !hasMoreData
          // console.log('分页状态:', {
          //   currentPage: page.currentPage,
          //   pageSize: page.pageSize,
          //   currentDataLength: faultsList.value.length,
          //   totalData: allMockData.value.length,
          //   hasMoreData,
          //   pullUpFinish: pullUpFinish.value
          // })
        } catch (error) {
          // 异常情况下重置状态
          pullDown.value = false
          pullUp.value = false
        }
      }, 1000)
    }
    // 下拉刷新
    const handleRefresh = () => {
      if (pullDown.value) return
      pullDown.value = true
      pullUpFinish.value = false
      page.currentPage = 1
      getList()
    }
    // 上拉加载更多
    const handleLoadMore = () => {
      if (pullUp.value || pullUpFinish.value) return
      page.currentPage++
      getList()
    }
    // 查看详情
    const handleItemClick = (item: any) => {
      router.push({
        path: '/commonService/faultsDetails',
        query: {
          id: item.id
        }
      })
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
      faultsList,
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
  background: $backgroundPrimary;
  overflow: hidden;
  @include flexColumn;
  .pageHeader {
    padding: 12px 12px 0 12px;
  }
  .pageContent {
    flex: 1;
    background: $backgroundDefault;
    border-radius: $borderRadius24 $borderRadius24 0 0;
    overflow-x: hidden;
    overflow-y: auto;
    .listContentWrapper {
      padding: 0 calc(var(--van-padding-sm) + 12px) 0 calc(var(--van-padding-sm) + 12px);
      .listItemCard {
        padding: 16px;
        margin: 0 0 24px 0;
        background: $colorWhite;
        border: 1px solid $borderListColor;
        border-radius: $borderRadius20;
        box-shadow: 0 3px 10px 0 #1932641a;
        :deep(.van-cell) {
          padding: var(--van-cell-vertical-padding) 16px;
          gap: $gap28;
          .van-cell__title {
            .cardTitle {
              font-size: $fontSize32;
              line-height: $lineHeight40 !important;
              color: $colorDefault;
              font-weight: 700;
              line-height: 60px;
              text-align: justify;
              @include textEllipsis2;
            }
            .cardDescribe {
              padding: 12px 8px 0 0;
              @include textEllipsis2;
            }
          }
          .cardIcon {
            padding: 4px;
            background: linear-gradient(90deg, #3d96e9, #5a75d0);
            @include flexCenter;
            border-radius: 50%;
            color: $colorWhite;
          }
        }
      }
    }
  }
}
</style>
