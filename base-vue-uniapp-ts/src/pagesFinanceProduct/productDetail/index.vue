<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" headerTitle="金融产品")
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
                .header-detail
                  image.logo-img(:src="detailInfo.logoUrl" mode="widthFix" :lazy-load="true" alt="")
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
                    CustomTitle(title="产品介绍")
                    .customer-desc(v-if="detailInfo.productDesc") {{ detailInfo.productDesc }}
                    CNoData(v-else :showImg="false")
                    CustomTitle(title="适用客户")
                    .customer-desc(v-if="detailInfo.customerDesc") {{ detailInfo.customerDesc }}
                    CNoData(v-else :showImg="false")
                    CustomTitle(title="申请条件")
                    .entry-criteria(v-if="detailInfo.entryCriteria") {{ detailInfo.entryCriteria }}
                    CNoData(v-else :showImg="false")
              .footer-operation
                .operation-box.pinia-btn(@click.stop="collectionClick(detailInfo)")
                  i.iconfont(:class="detailInfo.isCollect ? 'icon-shouzanghou' : 'icon-shouzang'")
                  span.value {{ detailInfo.isCollect ? '取消收藏' : '加入收藏' }}
                .operation-box.primary-btn(@click.stop="applyClick(detailInfo)")
                  i.iconfont.icon-shenqing
                  span.value {{ '我要申请' }}
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
import { handleJudgeCollection, productApplyHandle } from '@/hooks/common'
import { preview } from '@/api/common/index'
import imgConstant from '@/common/imgConstant'
import Bus, { REFRESH, REFRESH_COLLECTION } from '@/common/bus'

export default defineComponent({
  name: 'ProductDetail',
  components: { Layout, CustomTitle, CNoData, LoginValidateModal },
  setup(props, context) {
    const commonStoreHook = userCommonStoreHook()
    // 下拉刷新状态
    const refresherTriggered = ref<boolean>(false)
    const guaranteeModeList: Ref<DictListItem[]> = ref([])
    const id: Ref<string> = ref('')
    const isCollect: Ref<boolean> = ref(false)
    const detailInfo: Ref<ProductListItem> = ref({} as ProductListItem)
    // 产品申请
    const { loginValidateRef, loginValidateType, jumpLoginFn, linkProductApply } = productApplyHandle()
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
          console.log('isCollect', isCollect.value)
          data['isCollect'] = isCollect.value
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
    // 产品收藏
    const collectionClick = async (item: ProductListItem) => {
      if (!item.id) return
      if (!jumpLoginFn()) return
      // 收藏
      handleJudgeCollection('1', item, (collectStatus: boolean) => {
        item.isCollect = collectStatus
        isCollect.value = item.isCollect
        const pages = getCurrentPages()
        const beforePage = pages[pages.length - 2].route
        console.log('beforePage', beforePage)
        Bus.$emit(REFRESH, true)
        Bus.$emit(REFRESH_COLLECTION, beforePage)
      })
    }
    // 产品申请
    const applyClick = async (item: ProductListItem) => {
      linkProductApply(item)
    }
    onMounted(() => {
      getGuaranteeMode()
      getProductDetail()
    })
    onLoad((options: any) => {
      id.value = options.id
      isCollect.value = options.isCollect === 'true' ? true : false
    })
    return {
      preview,
      imgConstant,
      formatMode,
      guaranteeModeList,
      isCollect,
      refresherTriggered,
      detailInfo,
      loginValidateRef,
      loginValidateType,
      refresherrefresh,
      collectionClick,
      applyClick
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
