<template lang="pug">
.pageWrapper
  .pageHeader
    SearchInput(showSearchIcon @select="onSelect")
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
                span.cardTitle {{ item.ITEM_NAME }}
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
import { itemInfosEhbList } from '@/api/helper/commonService'
import type { ItemInfosEhbItem } from '@/api/interface/commonService'

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
    const keyword = ref('')
    const scrollerRef = ref()
    // 下拉加载状态
    const pullDown = ref(false)
    // 上划懒加载loading状态
    const pullUp = ref(false)
    // 是否已加载完成，加载完成后不再触发 load 事件
    const pullUpFinish = ref(false)
    const serviceList = ref<ItemInfosEhbItem[]>([])
    const page = reactive<PageType>({
      currentPage: 1,
      pageSize: 5,
      total: 20
    })
    const regionSelectRef = ref()
    // 初始化数据
    const initData = () => {
      page.currentPage = 1
      pullUpFinish.value = false
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
      const params = {
        page: page.currentPage,
        limit: page.pageSize,
        sidx: '',
        order: 'desc',
        param: {
          itemName: keyword.value
        }
      }
      try {
        itemInfosEhbList(params)
          .then(result => {
            const resultData = result.data.list || []
            if (pullDown.value) {
              // 下拉刷新：重置数据
              serviceList.value = resultData
              pullDown.value = false
            } else {
              // 上拉加载：追加数据
              serviceList.value = [...serviceList.value, ...resultData]
              pullUp.value = false
            }
            // 判断是否还有更多数据
            const hasMoreData = result.data.limit < result.data.totalCount
            pullUpFinish.value = !hasMoreData
            nextTick(() => {
              scrollerRef.value && scrollerRef.value.checkPosition()
            })
          })
          .catch(error => {
            pullUpFinish.value = true
            pullDown.value = false
            pullUp.value = false
          })
      } catch (error) {
        pullUpFinish.value = true
        pullDown.value = false
        pullUp.value = false
      }
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
    // 搜索
    const onSelect = (key: string) => {
      keyword.value = key
      handleRefresh()
    }
    // 处理事项/服务
    const handleItemClick = (item: any) => {
      if (item.type === 'service') {
        const params = {
          transactCode: item.ITEM_CODE
        }
        ehbAppJssdk.operateWindow.openMatter(params)
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
      onSelect,
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
