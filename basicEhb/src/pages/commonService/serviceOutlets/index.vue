<template lang="pug">
.pageWrapper
  .mapT
    TMap(showSearch showSearchIcon)
  .slideUpWrapper(
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  )
    VanSticky(:container="pageWrapperRef" :offset-top="0")
      .stickyHeader
        .dragIndicator
        .filterBar
          .outletsRecommendation(v-if="outletsList.length")
            VanImage(width="18" height="auto" :src="getImage('commonService.iconOutletsRecommendation')" fit="contain")
            span {{ '推荐' }}
          .filterItem(@click="showFilter")
            .filterText {{ '全部区域' }}
            ChevronUp(v-if="showAreaFilter" size="20" color="#222222")
            ChevronDown(v-else size="20" color="#222222")
      .listContainer(:style="{ height: containerHeight + 'px' }")
        ScrollList(
          ref="scrollerRef"
          :pullDown="pullDown"
          :pullUp="pullUp"
          :pullUpFinish="pullUpFinish"
          @refresh="handleRefresh"
          @onLoad="handleLoadMore"
        )
          template(#list)
            VanCellGroup.listContentWrapper(v-if="outletsList.length")
              VanCell.listItemCard(v-for="(item, index) in outletsList" :key="item.id + '_' + index" insert center @click="handleGoAddress(item)")
                template(#title)
                  .titleText {{ item.name }}
                template(#label)
                  .locationInfo
                    .cardDistance {{ item.distance || '未知距离' }}
                    .divider {{ '|'  }}
                    .cardAddress {{ item.address }}
                template(#right-icon)
                  .cardRoadSign
                    VanImage(width="28" height="auto" :src="getImage('commonService.iconOutletsRoad')" fit="contain")
                    span {{ '到这去' }}
            NoData(v-if="outletsList.length === 0 && !pullUp")
              VanImage(width="50%" height="auto" :src="getImage('common.noData')" fit="contain")
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  nextTick,
  onUnmounted,
  getCurrentInstance
} from 'vue'
import TMap from '@/components/map/index.vue'
import ScrollList from '@/components/scrollList/index.vue'
import NoData from '@/components/noData/index.vue'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import { getImage } from '@/constants/images'
import type { PageType } from '@/common/interface/http'
import type { ActionSheetOptions } from '@/plugin/interface/selector'
import { getBase64AreaCode } from '@/api/helper/common'
import type { Base64AreaCodeParams } from '@/api/interface/common'
import type { PoiItem } from '@/hooks/interface/useTMap'
import { useTMap } from '@/hooks/useTMap'

export default defineComponent({
  name: 'ServiceOutlets',
  components: {
    TMap,
    ScrollList,
    NoData,
    ChevronDown,
    ChevronUp
  },
  setup() {
    const instance = getCurrentInstance()
    // 获取页面根元素
    const pageWrapperRef = ref(instance?.vnode.el)
    const pageHeight = ref(window.innerHeight)
    // 最小高度（40%）
    const minHeight = pageHeight.value * 0.4
    // 最大高度（75%）
    const maxHeight = pageHeight.value * 0.75
    // 初始高度设为最小高度
    const containerHeight = ref(minHeight)
    // 触摸开始位置
    const startY = ref(0)
    const scrollerRef = ref()
    // 下拉加载状态
    const pullDown = ref(false)
    // 上划懒加载loading状态
    const pullUp = ref(false)
    // 是否已加载完成，加载完成后不再触发 load 事件
    const pullUpFinish = ref(false)
    const page = reactive<PageType>({
      currentPage: 1,
      pageSize: 10,
      total: 30
    })
    // 筛选弹窗
    const showAreaFilter = ref(false)
    // 区域列表
    const areaList = ref<any[]>([])
    // 网点列表
    const outletsList = ref<any[]>([])
    const {
      mapContainer,
      isLoaded,
      searchModule,
      addMarker,
      clearMarkers,
      updateCenter,
      reloadMap
    } = useTMap()
    // 监听窗口 resize，适配设备高度变化
    const handleResize = () => {
      pageHeight.value = window.innerHeight
      const newMinHeight = pageHeight.value * 0.4
      const newMaxHeight = pageHeight.value * 0.75
      // 调整容器高度在新的最小/最大范围内
      containerHeight.value = Math.max(newMinHeight, Math.min(containerHeight.value, newMaxHeight))
    }
    // 触摸开始：记录初始位置（增加事件阻止冒泡，避免冲突）
    const handleTouchStart = (e: TouchEvent) => {
      e.stopPropagation()
      startY.value = e.touches[0].clientY
    }
    // 触摸移动：核心调整逻辑（优化滑动灵敏度，确保流畅）
    const handleTouchMove = (e: TouchEvent) => {
      e.stopPropagation()
      const currentY = e.touches[0].clientY
      // 滑动距离系数调整为 0.6，平衡灵敏度与稳定性
      const diff = (startY.value - currentY) * 0.6
      // 严格限制高度范围
      containerHeight.value = Math.max(minHeight, Math.min(containerHeight.value + diff, maxHeight))
      startY.value = currentY
    }
    // 触摸结束：惯性回弹优化
    const handleTouchEnd = () => {
      // 距离边界 30px 内自动吸附
      if (containerHeight.value < minHeight + 30) {
        containerHeight.value = minHeight
      } else if (containerHeight.value > maxHeight - 30) {
        containerHeight.value = maxHeight
      }
    }
    // 筛选弹窗显示
    const showFilter = () => {
      showAreaFilter.value = !showAreaFilter.value
      if (showAreaFilter.value) {
        const params: ActionSheetOptions = {
          title: '区域选择',
          cancelButton: '取消',
          otherButtons: areaList.value.map(item => item.name),
          success: res => {
            if (res.buttonIndex === '-1') {
              // 取消
            } else {
              // 筛选该区域数据
            }
          }
        }
        ehbAppJssdk.notice.actionSheet(params)
      }
    }
    // 获取区域列表
    const getAreaList = async () => {
      window.ehbAppJssdk.notice.showPreloader({
        text: '使劲加载中..'
      })
      try {
        const params: Base64AreaCodeParams = {
          transactNameBase64: '',
          regionCode: '420000000000',
          source: '1',
          isOnline: ''
        }
        const result = await getBase64AreaCode(params)
        if (+result.code === 1) {
          const data = result.data || {}
          areaList.value = data.areaList || []
          console.log('获取区划编码', result, areaList.value)
        }
      } catch (err) {
        console.log('err', err)
      } finally {
        window.ehbAppJssdk.notice.hidePreloader()
      }
    }
    // 获取列表数据
    const getList = () => {
      console.log('11111111111', searchModule.value?.hasResults(), searchModule.value?.getResults())
      if (searchModule.value && searchModule.value.hasResults()) {
        pullUp.value = !pullDown.value
        const searchResults = searchModule.value.getResults()
        if (pullDown.value) {
          // 下拉刷新：回到第一页
          const firstPageData = searchModule.value.getResults(1)
          outletsList.value = firstPageData.pois
          pullDown.value = false
          nextTick(() => {
            scrollerRef.value && scrollerRef.value.checkPosition()
          })
        } else if (pullUp.value) {
          // 上拉加载：获取下一页
          const nextPage = searchResults.currentPage + 1
          if (nextPage <= searchResults.totalPage) {
            const success = searchModule.value.switchPage(nextPage)
            if (success) {
              const nextPageData = searchModule.value.getResults(nextPage)
              outletsList.value = [...outletsList.value, ...nextPageData.pois]
            }
          }
          pullUp.value = false
          pullUpFinish.value = searchResults.currentPage >= searchResults.totalPage
        }
      } else {
        pullDown.value = false
        pullUp.value = false
      }
    }
    // 下拉刷新
    const handleRefresh = () => {
      if (pullDown.value) return
      pullDown.value = true
      pullUpFinish.value = false
      page.currentPage = 1
      getList()
    }
    // 加载更多
    const handleLoadMore = () => {
      if (pullUp.value || pullUpFinish.value) return
      page.currentPage++
      getList()
    }
    const handleGoAddress = (item: PoiItem) => {
      // 解析坐标
      const [lngStr, latStr] = item.lonlat.split(',')
      const longitude = Number(lngStr)
      const latitude = Number(latStr)
      ehbAppJssdk.map.openMap({
        destination: item.name,
        longitude: longitude,
        latitude: latitude
      })
      // ehbAppJssdk.map.getLocation({
      //   success: res => {
      //     ehbAppJssdk.map.openMap({
      //       destination: '湖北省广播电视管理局',
      //       longitude: 114.354542,
      //       latitude: 30.569506
      //     })
      //   }
      // })
    }
    onMounted(() => {
      // 获取区域列表
      getAreaList()
      // 获取网点数据
      getList()
      // 确保页面渲染完成后获取根元素
      nextTick(() => {
        pageWrapperRef.value = instance?.vnode.el
        containerHeight.value = minHeight
      })
      window.addEventListener('resize', handleResize)
    })
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })
    return {
      pageWrapperRef,
      containerHeight,
      scrollerRef,
      pullDown,
      pullUp,
      pullUpFinish,
      outletsList,
      showAreaFilter,
      getImage,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      showFilter,
      handleRefresh,
      handleLoadMore,
      handleGoAddress
    }
  }
})
</script>

<style lang="scss" scoped>
.pageWrapper {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  @include flexColumn;
  position: relative;
  .mapT {
    height: 60%;
    position: relative;
    z-index: 1;
  }
  .slideUpWrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    touch-action: none;
    user-select: none;
    :deep(.van-sticky) {
      background: linear-gradient(180deg, #dfecfb 5%, #ffffff 18%);
      .stickyHeader {
        border-radius: $borderRadius24 $borderRadius24 0 0;
        .dragIndicator {
          width: 72px;
          height: 6px;
          background: $colorLink;
          border-radius: 3px;
          margin: 12px auto;
        }
        .filterBar {
          position: relative;
          @include flexJustifyEnd;
          padding: 0 30px 16px;
          gap: $gap36;
          border-bottom: 1px solid $borderListColor;
          .outletsRecommendation {
            position: absolute;
            top: 0;
            left: 0;
            padding: 10px 28px;
            background: linear-gradient(80deg, #fd815f, #fb506f);
            border-radius: $borderRadius30 0;
            @include flexCenter;
            span {
              font-size: $fontSize28;
              padding: 0 0 0 8px;
              font-weight: 500;
              color: $colorWhite;
            }
          }
          .filterItem {
            padding: 8px 16px;
            font-size: $fontSize30;
            font-weight: 500;
            letter-spacing: 2px;
            line-height: $lineHeight36;
            color: $colorDefault;
            @include flexCenter;
            .filterText {
              padding: 0 4px 0 0;
            }
          }
        }
      }
      .listContainer {
        overflow: hidden;
        transition: height 0.1s ease-out;
        .scrollList {
          padding: 0 0 24px 0;
        }
        .listContentWrapper {
          background: transparent;
          @include flexColumn;
          gap: $gap10;
          .listItemCard {
            padding: 20px 36px;
            background: transparent;
            border-radius: $borderRadius16;
            @include flexBetween;
            .titleText {
              color: $colorLink;
              font-size: $fontSize34;
              font-weight: 700;
            }
            .locationInfo {
              padding: 4px 0;
              @include flexAlignCenter;
              color: $colorInfo;
              font-size: $fontSize26;
              font-weight: 500;
              line-height: $lineHeight46;
              .divider {
                padding: 0 10px;
              }
            }
            .cardRoadSign {
              @include flexColumnCenter;
              span {
                padding: 6px 0 0 0;
                color: $colorInfo;
                font-size: $fontSize24;
                font-weight: 500;
                line-height: $lineHeight36;
              }
            }
          }
        }
      }
    }
  }
}
</style>
