<template lang="pug">
.mapContainer.w-100.h-100
  #tMap(ref="mapContainer" :style="{ height: height }")
  SearchInput(v-if="showSearch" :showSearchIcon="showSearchIcon" isMap placeholder="请输入网点名称" :shape="shape")
  VanLoading(v-if="!isLoaded && !loadError")
  .errorState(v-if="loadError")
    VanEmpty(description="地图加载失败")
    VanButton.reloadBtn(@click="handleReload" size="small") 重新加载
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import SearchInput from '@/components/searchInput/index.vue'
import { useTMap } from '@/hooks/useTMap'

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
    const { mapContainer, isLoaded, reloadMap, addMarker, updateCenter } = useTMap()
    // 处理搜索结果选择
    const handleSelectResult = (result: any) => {
      if (result.lng && result.lat && isLoaded.value) {
        updateCenter(result.lng, result.lat, 12)
        addMarker(result.lng, result.lat, result.name)
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
    return {
      mapContainer,
      wordKey,
      isLoaded,
      loadError,
      handleSelectResult,
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
