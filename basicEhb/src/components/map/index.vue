<template lang="pug">
.mapContainer.w-100.h-100
  #tMap(ref="mapContainer" :style="{ height: height }")
  SearchInput(v-if="showSearch" :showSearchIcon="showSearchIcon" isMap placeholder="请输入网点名称" :shape="shape" @select="handleSearch")
  VanLoading(v-if="!isLoaded && !loadError")
  .errorState(v-if="loadError")
    VanEmpty(description="地图加载失败")
    VanButton.reloadBtn(@click="handleReload" size="small") 重新加载
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import SearchInput from '@/components/searchInput/index.vue'
import { useTMap } from '@/hooks/useTMap'
import type { GetLocationSuccessResult } from '@/plugin/interface/map'

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
  setup() {
    const wordKey = ref()
    // 加载失败
    const loadError = ref(false)
    // 定位信息
    const location = ref<GetLocationSuccessResult | null>({
      address: '中国湖北省武汉市洪山区关山街道软件园东路（在光谷软件园附近）',
      areaCode: '420111',
      city: '武汉市',
      district: '洪山区',
      latitude: 30.480833,
      longitude: 114.412708,
      province: '湖北省'
    })
    // 周边搜索半径
    const radius = ref(10000)
    const { mapContainer, isLoaded, searchModule, reloadMap } = useTMap()
    // 初始化定位信息
    const initLocation = () => {
      ehbAppJssdk.map.getLocation({
        success: (res: string) => {
          // location.value = JSON.parse(res) as GetLocationSuccessResult
        }
      })
    }
    // 处理搜索结果（假设搜索接口返回坐标）
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
        // 使用初始化时缓存的定位中心点
        const { longitude, latitude } = location.value
        const params = {
          keyword,
          center: { lng: longitude, lat: latitude },
          radius: radius.value
        }
        // 执行周边搜索
        searchModule.value?.searchNearby(params.keyword, params.center, params.radius)
      } catch (error) {
        console.error('搜索异常:', error)
      }
    }
    // 重新加载地图
    const handleReload = () => {
      loadError.value = false
      reloadMap()
    }
    // 监听加载状态，处理错误
    watch(isLoaded, (newVal: boolean) => {
      if (!newVal) {
        // 如果加载失败，设置错误状态
        setTimeout(() => {
          if (!isLoaded.value) {
            loadError.value = true
          }
        }, 3000)
      } else {
        loadError.value = false
      }
    })
    onMounted(() => {
      // 初始化定位
      initLocation()
    })
    return {
      mapContainer,
      wordKey,
      isLoaded,
      loadError,
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
