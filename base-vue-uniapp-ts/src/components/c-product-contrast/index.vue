<template lang="pug">
.c-product-contrast
  up-popup.contrast-popup(:show="showContrastPopup" mode="right" @close="showContrastPopup = false")
    .popup-header
      .title {{ '产品对比' }}
      .limit-tips(v-if="contrastData.length") {{ '最多可对比2个产品' }}
      .limit-tips(v-else)
        span {{ '没有添加产品' }}
        span {{ '请点击产品列表中的对比按钮' }}
    .popup-content
      .product-info(v-for="(item, index) in contrastData" :key="index" :class="contrastData.length === 1 ? 'show-bottom' : ''")
        .left-detail
          .title-name {{ item.name || '' }}
          .bank-name {{ item.institutionsName || '' }}
        .right-detele(@click="delProductContrast(item)")
          u-icon(name="trash" color="#4C5F99" size="20")
    .popup-footer
      u-button.larger-btn.u-pinia-btn(type="info" @click="showContrastPopup = false") {{ '关闭' }}
      u-button.larger-btn.u-primary-btn(type="primary" :disabled="!contrastData.length" @click="startContrast") {{ '开始对比' }}
</template>

<script lang="ts">
import type { ProductListItem } from '@/api/financeProduct/types'
import { linkJump } from '@/common/common'
import { userCommonStoreHook } from '@/store/modules/common'
import { computed, defineComponent, onMounted, ref, type Ref } from 'vue'

export default defineComponent({
  name: 'CProductContrast',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  },
  setup(props, context) {
    const commonHook = userCommonStoreHook()
    const showContrastPopup: Ref<boolean> = ref(false)
    const init = () => {
      showContrastPopup.value = true
    }
    const delProductContrast = (item: ProductListItem) => {
      commonHook.setProductContrastList(item, 'delete')
    }
    const startContrast = () => {
      linkJump('/pagesFinanceProduct/productContrast/index', () => {
        showContrastPopup.value = false
      })
    }
    const contrastData = computed(() => {
      return commonHook.productContrastList
    })
    context.expose({ init })
    onMounted(() => {
      console.log('contrastData', contrastData.value)
    })
    return {
      showContrastPopup,
      startContrast,
      delProductContrast,
      contrastData
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
