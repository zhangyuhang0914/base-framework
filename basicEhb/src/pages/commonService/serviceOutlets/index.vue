<template lang="pug">
.pageWrapper
  .mapT
    TMap(ref="tMapRef" showSearch showSearchIcon @onSearch="onSearch" @searchComplete="handleSearchComplete")
  .slideUpWrapper
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
          :immediateCheck="false"
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
                    .cardDistance {{ formatDistance(item) }}
                    .divider {{ '|'  }}
                    .cardAddress {{ item.address }}
                template(#right-icon)
                  .cardRoadSign
                    VanImage(width="28" height="auto" :src="getImage('commonService.iconOutletsRoad')" fit="contain")
                    span {{ '到这去' }}
            NoData(v-if="outletsList.length === 0 && !pullUp" showText text="暂无数据，请根据网点名称搜索")
              VanImage(width="50%" height="auto" :src="getImage('common.noData')" fit="contain")
              span {{ '暂无数据' }}
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, nextTick, onMounted, reactive, ref } from 'vue'
import TMap from '@/components/map/index.vue'
import ScrollList from '@/components/scrollList/index.vue'
import NoData from '@/components/noData/index.vue'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import { getImage } from '@/constants/images'
import type { ActionSheetOptions } from '@/plugin/interface/selector'
import type { Base64AreaCodeParams } from '@/api/interface/common'
import { getBase64AreaCode } from '@/api/helper/common'
import type { PoiItem, SearchResult } from '@/hooks/interface/useTMap'
import { CoordinateConverter } from '@/utils/map/coordinateConverter'

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
    const tMapRef = ref()
    // 获取页面根元素
    const pageWrapperRef = ref(instance?.vnode.el)
    const pageHeight = ref(window.innerHeight)
    // 最小高度（40%）
    const minHeight = pageHeight.value * 0.4
    // 最大高度（75%）
    const maxHeight = pageHeight.value * 0.75
    // 初始高度设为最小高度
    const containerHeight = ref(minHeight)
    const scrollerRef = ref()
    // 下拉加载状态
    const pullDown = ref(false)
    // 上划懒加载loading状态
    const pullUp = ref(false)
    // 是否已加载完成，加载完成后不再触发 load 事件
    const pullUpFinish = ref(false)
    const outletsList = ref<PoiItem[]>([])
    const page = reactive({
      currentPage: 1,
      totalPage: 1,
      totalCount: 0
    })
    // 筛选弹窗
    const showAreaFilter = ref(false)
    // 区域列表
    const areaList = ref<any[]>([])
    // 格式化距离显示
    const formatDistance = (item: PoiItem): string => {
      const lonlat = item.lonlat
      if (!lonlat) return item.distance || '未知距离'
      // 定位信息
      const location = tMapRef.value?.location
      // 经纬度实例
      const lonlatInstance = tMapRef.value?.lonLatModule
      const point2Lng = Number(lonlat.split(',')[0])
      const point2Lat = Number(lonlat.split(',')[1])
      // 计算两点距离
      const point1 = { lng: location.longitude, lat: location.latitude }
      const point2 = { lng: point2Lng, lat: point2Lat }
      const convertedPoint1 = CoordinateConverter.cgcs2000ToGcj02(point1.lng, point1.lat)
      const convertedPoint2 = CoordinateConverter.cgcs2000ToGcj02(point2.lng, point2.lat)
      // const convertedPoint1 = CoordinateConverter.wgs84togcj02(point1.lng, point1.lat)
      // const convertedPoint2 = CoordinateConverter.wgs84togcj02(point2.lng, point2.lat)
      console.log('坐标转换结果', convertedPoint1, convertedPoint2)
      // 计算两点距离
      // const distance = lonlatInstance.getDistanceBetweenTwoPoints(
      //   { lng: convertedPoint1[0], lat: convertedPoint1[1] },
      //   { lng: convertedPoint2[0], lat: convertedPoint2[1] }
      // )
      const distance = lonlatInstance.getDistanceBetweenTwoPoints(
        { lng: convertedPoint1.lng, lat: convertedPoint1.lat },
        { lng: convertedPoint2.lng, lat: convertedPoint2.lat }
      )
      const totalFormatted = lonlatInstance.formatDistance(distance)
      console.log('当前定位信息', location)
      console.log(`总距离: ${totalFormatted}`)
      return totalFormatted
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
            const resultData = JSON.parse(res)
            if (resultData.buttonIndex === '-1') return
            // 筛选该区域数据
            console.log('选择了区域:', areaList.value[resultData.buttonIndex])
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
    // 搜索
    const onSearch = () => {
      outletsList.value = []
    }
    // 搜索结果处理
    const handleSearchComplete = (result: SearchResult) => {
      // console.log('handleSearchComplete', result)
      if (result.currentPage === 1) {
        outletsList.value = result.pois
      } else {
        outletsList.value = [...outletsList.value, ...result.pois]
      }
      page.currentPage = result.currentPage
      page.totalPage = result.totalPage
      page.totalCount = result.totalCount
      pullDown.value = false
      pullUp.value = false
      pullUpFinish.value = !result.hasMore
      nextTick(() => {
        if (scrollerRef.value && scrollerRef.value.vanScrollBox) {
          scrollerRef.value.vanScrollBox.checkPosition?.()
        }
      })
    }
    // 下拉刷新
    const handleRefresh = () => {
      if (pullDown.value) return
      pullDown.value = true
      pullUpFinish.value = false
      const searchInstance = tMapRef.value?.searchModule
      if (searchInstance) {
        searchInstance.goToPage(1)
      } else {
        pullDown.value = false
      }
    }
    // 上拉加载更多
    const handleLoadMore = () => {
      if (pullUp.value || pullUpFinish.value) return
      pullUp.value = true
      const searchInstance = tMapRef.value?.searchModule
      if (searchInstance && page.currentPage < page.totalPage) {
        searchInstance.goToPage(page.currentPage + 1)
      } else {
        pullUpFinish.value = true
        pullUp.value = false
      }
    }
    // 导航
    const handleGoAddress = (item: PoiItem) => {
      // 解析坐标
      const [lngStr, latStr] = item.lonlat.split(',')
      const longitude = Number(lngStr)
      const latitude = Number(latStr)
      const point = { lng: longitude, lat: latitude }
      // const convertedPoint = CoordinateConverter.cgcs2000ToGcj02(point.lng, point.lat)
      ehbAppJssdk.map.coordinateConvert({
        convertType: '2',
        longitude: point.lng,
        latitude: point.lat,
        success: result => {
          console.log('导航:handleGoAddress', item, result)
          ehbAppJssdk.map.openMap({
            // 目标名称
            destination: item.name,
            // // 目标经度
            // longitude: convertedPoint[0],
            // // 目标纬度
            // latitude: convertedPoint[1]
            // 目标经度
            longitude: result.longitude,
            // 目标纬度
            latitude: result.latitude
          })
        }
      })
    }
    onMounted(() => {
      // 获取区域列表
      getAreaList()
      // 确保页面渲染完成后获取根元素
      nextTick(() => {
        pageWrapperRef.value = instance?.vnode.el
      })
    })

    return {
      tMapRef,
      pageWrapperRef,
      scrollerRef,
      containerHeight,
      pullDown,
      pullUp,
      pullUpFinish,
      outletsList,
      showAreaFilter,
      currentPage: page.currentPage,
      totalPage: page.totalPage,
      totalCount: page.totalCount,
      getImage,
      showFilter,
      onSearch,
      handleSearchComplete,
      handleRefresh,
      handleLoadMore,
      handleGoAddress,
      formatDistance
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
              .cardDistance {
                flex: none;
              }
              .divider {
                padding: 0 10px;
              }
              .cardAddress {
                padding: 0 12px;
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
