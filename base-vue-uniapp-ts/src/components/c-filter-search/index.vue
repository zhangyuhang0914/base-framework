<template lang="pug">
.c-filter-search(:style="{ height: customBarHeight + 'px' }")
  .status-bar(:style="{ height: statusBarHeight + 'px' }")
  .filter-wrap(:style="bindCustomStyle")
    u-icon.icon-jiantou-zuo(name="arrow-left" v-if="showBack" :color="headerColor" size="20" @click="handleGoBack")
    up-input.up-input(v-if="visiable" v-model="searchValue" placeholder="请输入关键字" @confirm="searchHandle" shape="circle")
      template(#prefix)
        picker.search-picker(@change="bindPickerChange" :value="pIndex" :range="range")
          span.suffix-right {{ getSearchName }}
          up-icon.icon-arrow-down(name="arrow-down-fill" size="12" :color="headerColor")
      template(#suffix)
        up-icon(name="search" size="22" :color="headerColor" @click="searchHandle")
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, nextTick, reactive, ref } from 'vue'
import CUniappPicker from '@/components/c-uniapp-picker/index.vue'
import Bus, { GLOBAL_SEARCH } from '@/common/bus'
import { goBack, linkJump } from '@/common/common'
import { userCommonStoreHook } from '@/store/modules/common'
import { onHide } from '@dcloudio/uni-app'
type SearchResultType = 'product' | 'policyGuide' | 'news' | 'platformConsultation'
interface SelectDataItem {
  value: string
  text: string
}
export default defineComponent({
  name: 'CFilterSearch',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  },
  components: { CUniappPicker },
  props: {
    visiable: {
      type: Boolean,
      default: true
    },
    customStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showBack: {
      type: Boolean,
      default: false
    },
    headerColor: {
      type: String,
      default: '#333'
    },
    goBack: {
      type: Function
    }
  },
  setup(props) {
    const instance = getCurrentInstance()
    const commonStoreHook = userCommonStoreHook()
    const globalProperties = instance?.appContext.config.globalProperties
    // 状态栏高度
    const customBarHeight = globalProperties?.customBarHeight
    const statusBarHeight = globalProperties?.statusBarHeight
    const headerBarHeight = globalProperties?.headerBarHeight
    const searchValue = ref<string>('')
    const searchType = ref<SearchResultType>('product')
    const selectData: SelectDataItem[] = reactive([
      {
        value: 'product',
        text: '产品'
      },
      {
        value: 'policyGuide',
        text: '政策'
      },
      {
        value: 'news',
        text: '新闻'
      },
      {
        value: 'platformConsultation',
        text: '资讯'
      }
    ])
    const pIndex = ref()
    const handleGoBack = () => {
      if (props.goBack) {
        props.goBack()
        return
      }
      goBack()
    }
    const searchHandle = (value: string) => {
      console.log('searchHandle', searchType.value, searchValue.value)
      if (searchType.value === 'product') {
        commonStoreHook.setTabBar(1, '金融产品', true, () => {
          setTimeout(() => {
            nextTick(() => {
              Bus.$emit(GLOBAL_SEARCH, {
                searchType: searchType.value,
                keyword: searchValue.value
              })
            })
          }, 300)
        })
      } else if (['policyGuide', 'news', 'platformConsultation'].includes(searchType.value)) {
        linkJump(`/pagesIndex/policyNews/index?searchType=${searchType.value}&keyword=${searchValue.value}`)
      }
    }
    const bindPickerChange = (e: AnyObject) => {
      pIndex.value = e.detail.value
      searchType.value = selectData[pIndex.value].value as SearchResultType
    }
    const bindCustomStyle = computed(() => {
      return { height: headerBarHeight + 'px', ...props.customStyle }
    })
    const range = computed(() => {
      return selectData.map((item: SelectDataItem) => {
        if (item && item['text']) {
          return item['text']
        }
      })
    })
    const getSearchName = computed(() => {
      return '搜' + selectData.find((item: SelectDataItem) => item.value === searchType.value)?.text
    })
    return {
      customBarHeight,
      statusBarHeight,
      headerBarHeight,
      searchValue,
      searchType,
      selectData,
      handleGoBack,
      searchHandle,
      bindPickerChange,
      pIndex,
      bindCustomStyle,
      range,
      getSearchName
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
