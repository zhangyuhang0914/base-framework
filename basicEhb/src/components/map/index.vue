<template lang="pug">
.mapContainer.w-100.h-100
  #tMap(ref="mapContainer" :style="{ height: height }")
  SearchInput(v-if="showSearch" :showSearchIcon="showSearchIcon" isMap placeholder="请输入网点名称" :shape="shape" @select="handleSearch")
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import SearchInput from '@/components/searchInput/index.vue'
import { useTMap } from '@/hooks/useTMap'
import type { GetLocationSuccessResult } from '@/plugin/interface/map'
import { MapSearch } from '@/hooks/mapModules/mapSearch'
import { MapLngLat } from '@/hooks/mapModules/mapLngLat'

export default defineComponent({
  name: 'TMap',
  components: {
    SearchInput
  },
  props: {
    height: {
      type: String,
      default: '100%'
    },
    placeholder: {
      type: String,
      default: '请输入网点名称'
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    showSearchIcon: {
      type: Boolean,
      default: false
    },
    shape: {
      type: String,
      default: 'square'
    }
  },
  emits: ['onSearch', 'searchComplete'],
  setup(props, context) {
    const wordKey = ref()
    const mapContainer = ref<HTMLElement | null>(null)
    // 定位信息
    // const location = ref<GetLocationSuccessResult | null>(null)
    const location = ref<GetLocationSuccessResult | null>({
      address: '中国湖北省武汉市洪山区关山街道软件园东路（在光谷软件园附近）',
      areaCode: '420111',
      city: '武汉市',
      district: '洪山区',
      longitude: 114.412746,
      latitude: 30.480959,
      province: '湖北省'
    })
    // 周边搜索半径
    const radius = ref(10000)
    const { mapInstance, initMap, reloadMap } = useTMap()
    const searchModule = ref<MapSearch | null>(null)
    const lonLatModule = ref<MapLngLat | null>(null)
    // 初始化定位信息
    const initLocation = () => {
      ehbAppJssdk.map.getLocation({
        success: (res: string) => {
          location.value = JSON.parse(res) as GetLocationSuccessResult
        }
      })
    }
    // 初始化地图
    const initTMap = () => {
      mapContainer.value && initMap(mapContainer.value)
      // 初始化服务类-搜索
      searchModule.value = new MapSearch(mapInstance.value, result => {
        context.emit('searchComplete', result)
      })
      // 初始化实体类-经纬度
      lonLatModule.value = new MapLngLat(mapInstance.value)
    }
    // 处理搜索结果
    const handleSearch = (keyword: string) => {
      if (!keyword.trim()) {
        ehbAppJssdk.notice.toast({
          text: '请输入网点名称'
        })
        return
      }
      if (!searchModule.value) {
        ehbAppJssdk.notice.toast({
          text: '天地图加载失败，请刷新后重试'
        })
        return
      }
      if (!location.value) {
        ehbAppJssdk.notice.toast({
          text: '未获取到位置信息，请稍后重试'
        })
        return
      }
      try {
        context.emit('onSearch')
        // 使用初始化时缓存的定位中心点
        const { longitude, latitude } = location.value
        // 执行周边搜索
        // searchModule.value.searchNearby(keyword, { lng: longitude, lat: latitude }, radius.value)
        // 关键词搜索
        searchModule.value.searchByKeyword(keyword)
      } catch (error) {
        console.error('搜索异常:', error)
      }
    }
    // 重新加载地图
    const handleReload = () => {
      mapContainer.value && reloadMap(mapContainer.value)
      // 初始化服务类-搜索
      searchModule.value = new MapSearch(mapInstance.value, result => {
        context.emit('searchComplete', result)
      })
    }
    onMounted(() => {
      // 初始化定位信息
      initLocation()
      // 初始化地图
      initTMap()
    })
    context.expose({
      location,
      searchModule,
      lonLatModule
    })
    return {
      mapContainer,
      wordKey,
      handleSearch,
      handleReload
    }
  },
  mounted() {}
})
</script>

<style lang="scss" scoped>
.mapContainer {
  height: 100%;
  position: relative;
  #tMap {
    width: 100%;
    border: 1px solid #e0e0e0;
    border-radius: $borderRadius8;
  }
  .loading,
  .error-state {
    @include flexCenter;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: $backgroundDefault;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    .loading-text {
      margin-top: 12px;
      font-size: $fontSize28;
      color: $colorDefault;
    }
    .reload-btn {
      margin-top: 16px;
    }
  }
}
</style>
