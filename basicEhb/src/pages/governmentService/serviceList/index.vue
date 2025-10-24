<template lang="pug">
.pageWrapper
  .pageHeader
    SearchInput(showSearchIcon)
    HotSearch
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
        .listContentWrapper(v-if="serviceList.length")
          .listItemCard(
            v-for="(item, index) in serviceList"
            :key="item.id + '_' + index"
          )
            VanCell(inset center)
              template(#title)
                span.cardTitle {{ item.name }}
              template(#right-icon)
                VanTag.cardTag(
                  color="linear-gradient(95deg, #FEAD7D, #FE8947)" 
                  text-color="#FFFFFF"
                  @click="handleItemClick(item)"
                ) {{ '办事指南' }}
        NoData(v-if="serviceList.length === 0 && !pullDown && !pullUp") 
  RegionSelect(ref="regionSelectRef")
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, nextTick } from 'vue'
import SearchInput from '@/components/searchInput/index.vue'
import HotSearch from '@/pages/governmentService/components/hotSearch/index.vue'
import ScrollList from '@/components/scrollList/index.vue'
import NoData from '@/components/noData/index.vue'
import RegionSelect from '@/components/regionSelect/index.vue'
import type { PageType } from '@/common/interface/http'

export default defineComponent({
  name: 'ServiceList',
  components: {
    SearchInput,
    HotSearch,
    ScrollList,
    NoData,
    RegionSelect
  },
  setup() {
    const scrollerRef = ref()
    // 下拉加载状态
    const pullDown = ref(false)
    // 上划懒加载loading状态
    const pullUp = ref(false)
    // 是否已加载完成，加载完成后不再触发 load 事件
    const pullUpFinish = ref(false)
    const serviceList = ref<any[]>([])
    const page = reactive<PageType>({
      currentPage: 1,
      pageSize: 5,
      total: 20
    })
    const regionSelectRef = ref()
    // 模拟数据源
    const allMockData = ref<any[]>([])
    const initMockData = () => {
      const baseData: any[] = [
        { id: 1, name: '机关事业单位', type: 'service', serviceId: '122619' },
        {
          id: 2,
          name: '【省集中企保系统】灵活就业养老保险暂停',
          type: 'matter',
          serviceId: 'F9DE4A9799E'
        },
        {
          id: 3,
          name: '【省集中企保系统】灵活就业养老保险新增/续保',
          type: 'matter',
          serviceId: 'CDB71CCDE5FD'
        }
      ]
      // 模拟分页数据（动态生成更多数据）
      const startIndex = (page.currentPage - 1) * page.pageSize
      const dynamicData: any[] = Array.from({ length: 15 }, (_, i) => ({
        id: startIndex + i + 4,
        name: `服务项目 ${startIndex + i + 4}`,
        type: i % 2 === 0 ? 'service' : 'matter',
        serviceId: `SERVICE_${startIndex + i + 4}`
      }))
      allMockData.value = [...baseData, ...dynamicData]
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
    // 获取列表（
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
          console.log(`第${page.currentPage}页数据:`, {
            startIndex,
            endIndex,
            dataLength: currentPageData.length,
            totalData: allMockData.value.length
          })
          if (pullDown.value) {
            // 下拉刷新：重置数据
            serviceList.value = currentPageData
            pullDown.value = false
          } else {
            // 上拉加载：追加数据
            serviceList.value = [...serviceList.value, ...currentPageData]
            pullUp.value = false
          }
          // 判断是否还有更多数据
          const hasMoreData = endIndex < allMockData.value.length
          pullUpFinish.value = !hasMoreData
          nextTick(() => {
            scrollerRef.value && scrollerRef.value.checkPosition()
          })
          console.log('分页状态:', {
            currentPage: page.currentPage,
            pageSize: page.pageSize,
            currentDataLength: serviceList.value.length,
            totalData: allMockData.value.length,
            hasMoreData,
            pullUpFinish: pullUpFinish.value
          })
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
      serviceList,
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
        .cardTitle {
          font-size: $fontSize34;
          color: $colorDefault;
          font-weight: 700;
          line-height: 60px;
          text-align: justify;
        }
        .cardTag {
          flex-shrink: 0;
          margin: 0 0 0 12px;
          padding: 12px 18px;
          border-radius: $borderRadius6;
          font-size: $fontSize28;
        }
      }
    }
  }
}
</style>
