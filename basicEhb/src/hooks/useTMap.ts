import type { TMapOptions } from '@/hooks/interface/useTMap'
import { MapSearch } from '@/hooks/mapModules/mapSearch'
import { ref, onMounted, onUnmounted } from 'vue'

export function useTMap(options: TMapOptions = {}) {
  // 地图核心状态
  // 地图实例
  const mapInstance = ref<any>(null)
  // 容器
  const mapContainer = ref<HTMLElement | null>(null)
  const isLoaded = ref(false)
  const isInitializing = ref(false)
  // 记录所有标记
  const markers = ref<any[]>([])
  // 默认坐标：湖北省广播电视管理局
  const defaultCenter = {
    lng: 114.354542,
    lat: 30.569506
  }
  // 功能类实例
  const searchModule = ref<MapSearch | null>(null)
  // 初始化地图
  const initMap = () => {
    if (isInitializing.value) return
    if (!window.T) {
      console.error('天地图 API 未加载')
      return
    }
    if (!mapContainer.value) {
      console.error('地图容器未找到')
      return
    }
    isInitializing.value = true
    try {
      mapContainer.value.innerHTML = ''
      const centerLng = options.lng || defaultCenter.lng
      const centerLat = options.lat || defaultCenter.lat
      // 创建地图实例
      mapInstance.value = new window.T.Map(mapContainer.value, {
        projection: 'EPSG:4326',
        controls: [],
        zoom: 16
      })
      mapInstance.value.centerAndZoom(new window.T.LngLat(centerLng, centerLat), 16)
      removeCopyright()
      // 初始化功能类
      searchModule.value = new MapSearch(mapInstance.value)
      isLoaded.value = true
      isInitializing.value = false
    } catch (error) {
      console.error('天地图初始化失败:', error)
      isInitializing.value = false
      isLoaded.value = false
    }
  }
  // 添加标记点
  const addMarker = (lng: number, lat: number, title: string = '') => {
    if (!mapInstance.value || !window.T) return null
    const marker = new window.T.Marker(new window.T.LngLat(lng, lat))
    mapInstance.value.addOverLay(marker)
    markers.value.push(marker) // 记录标记
    if (title) {
      const infoWindow = new window.T.InfoWindow()
      infoWindow.setContent(title)
      marker.openInfoWindow(infoWindow)
    }
    return marker
  }
  // 清除所有标记
  const clearMarkers = () => {
    markers.value.forEach(marker => {
      mapInstance.value?.removeOverLay(marker)
    })
    markers.value = []
  }
  // 添加地图控件
  const addControls = () => {
    if (!mapInstance.value || !window.T) return
    // 添加缩放控件
    const zoomCtrl = new window.T.Control.Zoom()
    mapInstance.value.addControl(zoomCtrl)
    // 添加比例尺控件
    const scaleCtrl = new window.T.Control.Scale()
    mapInstance.value.addControl(scaleCtrl)
  }
  // 更新地图中心点
  const updateCenter = (lng: number, lat: number, zoom: number = 12) => {
    if (!mapInstance.value || !window.T) return
    mapInstance.value.centerAndZoom(new window.T.LngLat(lng, lat), zoom)
  }
  // 去除水印版权信息
  const removeCopyright = () => {
    if (!mapInstance.value || !window.T) return
    const mapDom = document.getElementsByClassName('tdt-control-copyright tdt-control')
    if (mapDom[0]) {
      mapDom[0].innerHTML = ''
    }
  }
  // 重新加载地图
  const reloadMap = () => {
    safeDestroyMap()
    setTimeout(() => {
      initMap()
    }, 100)
  }
  // 检查天地图API是否加载完成
  const checkTMapAPI = (): Promise<boolean> => {
    return new Promise(resolve => {
      if (window.T) {
        resolve(true)
        return
      }
      let checkCount = 0
      // 最多检查5秒
      const maxCheckCount = 50
      const checkInterval = setInterval(() => {
        checkCount++
        if (window.T) {
          clearInterval(checkInterval)
          resolve(true)
        } else if (checkCount >= maxCheckCount) {
          clearInterval(checkInterval)
          console.error('天地图API加载超时')
          resolve(false)
        }
      }, 100)
    })
  }
  // 安全销毁地图
  const safeDestroyMap = () => {
    clearMarkers() // 先清除标记
    if (mapInstance.value) {
      try {
        // 检查是否存在 destroy 方法
        if (typeof mapInstance.value.destroy === 'function') {
          mapInstance.value.destroy()
        } else {
          // 如果没有 destroy 方法，手动清理
          if (mapContainer.value) {
            mapContainer.value.innerHTML = ''
          }
        }
      } catch (error) {
        console.warn('地图销毁过程中出现错误:', error)
        // 即使销毁失败，也要重置状态
        if (mapContainer.value) {
          mapContainer.value.innerHTML = ''
        }
      } finally {
        mapInstance.value = null
        isLoaded.value = false
      }
    }
  }
  onMounted(async () => {
    const isAPILoaded = await checkTMapAPI()
    isAPILoaded && initMap()
  })
  onUnmounted(() => {
    safeDestroyMap()
  })

  return {
    mapInstance,
    mapContainer,
    isLoaded,
    // 核心方法
    addMarker,
    addControls,
    clearMarkers,
    updateCenter,
    reloadMap,
    // 功能模块
    searchModule
  }
}
