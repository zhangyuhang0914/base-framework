<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#DAECFE" statusBackground="#DAECFE" headerTitle="金融产品")
    template(#main)
      .layout-main
        .main-container
          .product-detail-main
            scroll-view.scroll-view(
              scroll-y
              :refresher-enabled='true'
              :refresher-triggered='refresherTriggered'
              @refresherrefresh='refresherrefresh'
            )
              .detail-main
                .header-detail(:style="{ backgroundImage: `url(${preview(imgConstant['wx_financeProduct_header-bg'])})`, backgroundSize: '100%', backgroundRpeat: 'no-repeat' }")
                  img.logo-img(:src="detailInfo.logoUrl" alt="")
                  .header-title-box
                    .title {{ detailInfo.name }}
                    .institutions-name {{ detailInfo.institutionsName }}
                .content-main
                  .loan-data
                    .loan-limit-box.c-column
                      .value {{ detailInfo.loanLimit }}
                      .label {{ '贷款额度' }}
                    .rate-range-box.c-column
                      .value {{ detailInfo.rateRange }}
                      .label {{ '参考利率(年化)' }}
                    .loan-period-box.c-column
                      .value {{ detailInfo.loanPeriod }}
                      .label {{ '贷款期限' }}
                    .guarantee-mode-box.c-column
                      .value(v-if="detailInfo.guaranteeMode + ''") {{ formatMode(detailInfo.guaranteeMode, guaranteeModeList, detailInfo.guaranteeModeExtra) }}
                      .label {{ '担保方式' }}
                  .product-info
                    CustomTitle(title="适用客户")
                    .customer-desc(v-if="detailInfo.customerDesc") {{ detailInfo.customerDesc }}
                    CNoData(v-else :showImg="false")
                    CustomTitle(title="申请条件")
                    .entry-criteria(v-if="detailInfo.entryCriteria") {{ detailInfo.entryCriteria }}
                    CNoData(v-else :showImg="false")
              .footer-operation
                u-button(type="primary" @click="handleApply") {{ '立即申请' }}
            LoginValidateModal(ref='loginValidateRef' :type='loginValidateType')
</template>

<script lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { defineComponent, type Ref, ref, onMounted } from 'vue'
import Layout from '@/components/layout/index.vue'
import CustomTitle from '@/components/custom-title/index.vue'
import CNoData from '@/components/c-no-data/index.vue'
import LoginValidateModal from '@/pages/user/loginValidateModal/index.vue'
import { formatMode } from '@/util/utils'
import { productInfo } from '@/api/financeProduct'
import type { ApiResponse } from '@/common/http/types'
import type { ProductListItem } from '@/api/financeProduct/types'
import { fileDownload } from '@/api/index'
import { userCommonStoreHook } from '@/store/modules/common'
import type { DictListItem } from '@/api/index/types'
import { productApplyHandle } from '@/hooks/common'
import { preview } from '@/api/common/index'
import imgConstant from '@/common/imgConstant'

export default defineComponent({
  name: 'ProductDetail',
  components: { Layout, CustomTitle, CNoData, LoginValidateModal },
  setup(props, context) {
    const commonStoreHook = userCommonStoreHook()
    // 下拉刷新状态
    const refresherTriggered = ref<boolean>(false)
    const guaranteeModeList: Ref<DictListItem[]> = ref([])
    const id: Ref<string> = ref('')
    const detailInfo: Ref<ProductListItem> = ref({} as ProductListItem)
    const { loginValidateRef, loginValidateType, linkProductApply } = productApplyHandle()
    // 下拉刷新
    const refresherrefresh = () => {
      refresherTriggered.value = true
      getProductDetail()
    }
    // 获取产品详情
    const getProductDetail = () => {
      productInfo(id.value)
        .then((result: ApiResponse<ProductListItem>) => {
          let data = result.data
          data['logoUrl'] = data.logoFileId && fileDownload(data.logoFileId)
          data['loanPeriod'] = data.loanPeriodBegin === 0 ? data.loanPeriodEnd + '个月及以下' : data.loanPeriodBegin + '-' + data.loanPeriodEnd + '个月'
          data['rateRange'] = data.rateRangeBegin + '%-' + data.rateRangeEnd + '%'
          data['loanLimit'] = data.loanLimitBegin + '~' + data.loanLimitEnd + '万元'
          data['isCollect'] = data.whetherCollection === '0' ? true : false
          detailInfo.value = data
        })
        .finally(() => {
          refresherTriggered.value = false
        })
    }
    // 获取担保方式
    const getGuaranteeMode = async () => {
      const result: DictListItem[] = await commonStoreHook.getDict('guarantee_type')
      guaranteeModeList.value = result
    }
    // 产品申请
    const handleApply = () => {
      linkProductApply(detailInfo.value)
    }
    onMounted(() => {
      getGuaranteeMode()
      getProductDetail()
    })
    onLoad((options: any) => {
      id.value = options.id
    })
    return {
      preview,
      imgConstant,
      formatMode,
      guaranteeModeList,
      refresherTriggered,
      detailInfo,
      loginValidateRef,
      loginValidateType,
      refresherrefresh,
      handleApply
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
