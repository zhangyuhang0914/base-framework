<template lang="pug">
.page-view
  Layout(showHeaderBar showBack headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" :headerTitle="pageName")
    template(#main)
      .zone-scroll-content
        scroll-view.scroll-view(
          scroll-y
          @scrolltolower="scrolltolower"
          @refresherrefresh='refresherrefresh'
          :refresher-enabled='true'
          :refresher-triggered='refresherTriggered'
        )
          .zone-introduce(:style="{ background: `url(${previewImg('wx_servicesZone_commonBannerBg')})`, backgroundSize: '100%', backgroundRepeat: 'no-repeat' }")
            CRich(:content='htmlInfo.content')
          .c-content
            .scroll-box(v-if="listData.length")
              //- # 后期优化-数据太多使用虚拟列表
              .scroll-item(v-for="(item, index) in listData" :key="index")
                .product-box(@click="productDetailClick(item)")
                  .product-header
                    .img-logo
                      image(:src="item.logoUrl" mode="widthFix" :lazy-load="true" alt="")
                    .product-title
                      .name.text-line2-overflow {{ item.name }}
                      .source {{ item.companySource }}
                  .product-content
                    .product-data
                      .rate-range-box.c-column
                        .value {{ item.rateRange }}
                        .label {{ '参考利率' }}
                      .loan-limit-box.c-column
                        .value {{ item.loanLimit }}
                        .label {{ '贷款额度' }}
                      .loan-period-box.c-column
                        .value {{ item.loanPeriod }}
                        .label {{ '贷款期限' }}
                  .product-footer
                    .guarantee-mode-left
                      .mode-value(v-if="item.guaranteeMode + ''") {{ '担保方式：' + formatMode(item.guaranteeMode, guaranteeModeList, item.guaranteeModeExtra) }}
                    .operation-box-right
                      .operation-box.collection-btn(@click.stop="collectionClick(item)")
                        i.iconfont(:class="item.isCollect ? 'icon-shouzanghou' : 'icon-shouzang'")
                      .operation-box.apply-btn(@click.stop="applyClick(item)")
                        i.iconfont.icon-shenqing
                      .operation-box.compare-btn(@click.stop='handleCompare(item)')
                        i.iconfont.icon-duibi
              u-loadmore(:status="loadMoreStatus" @loadmore="getMore")
            .no-data-view(v-else)
              CNoData
        LoginValidateModal(ref='loginValidateRef' :type='loginValidateType')
        CProductContrast(ref="CProductContrastRef")
</template>

<script lang="ts">
import { defineComponent, reactive, ref, type Ref } from 'vue'
import Layout from '@/components/layout/index.vue'
import LoginValidateModal from '@/pages/user/loginValidateModal/index.vue'
import CProductContrast from '@/components/c-product-contrast/index.vue'
import CRich from '@/components/c-rich/index.vue'
import CNoData from '@/components/c-no-data/index.vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { previewImg } from '@/util/utils'
import { userCommonStoreHook } from '@/store/modules/common'
import type { ProductListItem } from '@/api/financeProduct/types'
import type { PageItem } from '@/components/c-product-list/type'
import { productInfoList } from '@/api/financeProduct'
import type { ApiResponse } from '@/common/http/types'
import { cmsInfo, fileDownload } from '@/api/index'
import { formatMode } from '@/util/utils'
import { decode } from '@/util/base64'
import type { CmsInfoResponseType, DictListItem } from '@/api/index/types'
import { linkJump } from '@/common/common'
import { handleJudgeCollection, productApplyHandle, setProductContrast } from '@/hooks/common'
import Bus, { REFRESH } from '@/common/bus'

export default defineComponent({
  name: 'CommonZone',
  components: { Layout, LoginValidateModal, CProductContrast, CRich, CNoData },
  setup() {
    const commonStoreHook = userCommonStoreHook()
    const pageName = ref<string>('')
    const pageType = ref<string>('')
    const pageChannelId = ref<string>('')
    const htmlInfo = ref({})
    const queryForm = ref({
      bankId: '', // 金融机构
      productMainType: '' // 产品类型
    })
    const listData = ref<ProductListItem[]>([])
    const guaranteeModeList: Ref<DictListItem[]> = ref([]) // 担保方式
    // LoadMore组件状态：loadmore查看更多 loading加载中 nomore没有更多
    const loadMoreStatus = ref<string>('loadmore')
    // 下拉刷新状态
    const refresherTriggered = ref<boolean>(false)
    const page = reactive<PageItem>({
      currentPage: 1,
      pageSize: 10,
      totalPage: 0
    })
    // 产品申请
    const { loginValidateRef, loginValidateType, jumpLoginFn, linkProductApply } = productApplyHandle()
    // 产品对比
    const CProductContrastRef = ref()
    // 获取担保方式
    const getGuaranteeMode = async () => {
      const result: DictListItem[] = await commonStoreHook.getDict('guarantee_type')
      guaranteeModeList.value = result
    }
    // 滚动到底部刷新
    const scrolltolower = () => {
      if (loadMoreStatus.value === 'loadmore') {
        // 若此时可以加载更多才触发，避免频繁触底发起请求
        getMore()
      }
    }
    // 下拉刷新
    const refresherrefresh = () => {
      console.log('下拉刷新', refresherTriggered.value)
      refresherTriggered.value = true
      getListData(true)
    }
    // 点击加载更多或是scroll-view组件触底加载更多
    const getMore = () => {
      if (loadMoreStatus.value !== 'loadmore') {
        return
      }
      // 加载下一页
      page.currentPage = page.currentPage + 1
      getListData()
    }
    // 获取简介信息
    const getDetailInfo = () => {
      cmsInfo(pageChannelId.value)
        .then((value: ApiResponse<CmsInfoResponseType>) => {
          value.data.content = decode(value.data.content)
          htmlInfo.value = value.data || {}
          console.log('htmlInfo', htmlInfo.value)
        })
        .catch(reason => {
          console.error(reason)
        })
    }
    // 获取产品列表
    const getListData = (reset = false) => {
      // 重置页码
      if (reset) {
        page.currentPage = 1
        listData.value = []
      }
      let params = {
        dockingFlag: '0', // 过滤市州产品
        isApplets: '1',
        page: page.currentPage,
        limit: page.pageSize,
        dkje: '', // 贷款金额
        dkqx: '', // 贷款期限
        guaranteeMode: '', // 担保方式
        bank_id: queryForm.value.bankId, // 金融机构
        city_code: '', // 所在区域
        name: '', // 产品名称
        productMainType: queryForm.value.productMainType, // 产品类型
        fin_institutions_info_id: '', // 产品机构id
        sidx: 'pubdate',
        order: 'desc'
      }
      loadMoreStatus.value = 'loading'
      productInfoList(params)
        .then((result: ApiResponse<ProductListItem[]>) => {
          let data = result.page
          data.list.map((item: ProductListItem) => {
            item['logoUrl'] = item.logoFileId && fileDownload(item.logoFileId)
            item['companySource'] = item.institutionsName + '提供'
            item['loanPeriod'] = item.loanPeriodBegin === 0 ? item.loanPeriodEnd + '个月及以下' : item.loanPeriodBegin + '-' + item.loanPeriodEnd + '个月'
            item['rateRange'] = item.rateRangeBegin + '%-' + item.rateRangeEnd + '%'
            item['loanLimit'] = item.loanLimitBegin + '~' + item.loanLimitEnd + '万元'
            item['productSource'] = '产品来源：' + item.institutionsName
            item['isCollect'] = item.whetherCollection + '' === '0' ? true : false
          })
          if (data.currPage === 1 && data.totalCount === 0 && data.totalPage === 0) {
            // 暂无数据
            listData.value = []
          } else {
            listData.value = listData.value.concat(data.list || [])
          }
          page.totalPage = data.totalPage || 0
        })
        .finally(() => {
          if (page.currentPage === page.totalPage) {
            // 若为最后一页 则 return,没有更多
            loadMoreStatus.value = 'nomore'
          } else {
            loadMoreStatus.value = 'loadmore'
          }
          refresherTriggered.value = false
        })
    }
    // 产品详情
    const productDetailClick = (item: ProductListItem) => {
      linkJump(`/pagesFinanceProduct/productDetail/index?id=${item.id}&isCollect=${item.isCollect}`)
    }
    // 产品收藏
    const collectionClick = async (item: ProductListItem) => {
      if (!item.id) return
      if (!jumpLoginFn()) return
      handleJudgeCollection('1', item, (isCollect: boolean) => {
        item.isCollect = isCollect
        Bus.$emit(REFRESH, true)
      })
    }
    // 产品申请
    const applyClick = async (item: ProductListItem) => {
      if (!item.id) return
      linkProductApply(item)
    }
    // 产品对比
    const handleCompare = (item: ProductListItem) => {
      setProductContrast(item, 'push')
      CProductContrastRef.value && CProductContrastRef.value.init()
    }
    // 隐藏小程序后会自动销毁
    onShow(() => {
      Bus.$on(REFRESH, (beforePage: string) => {
        // 获取产品列表
        getListData(true)
      })
    })
    onLoad((options: AnyObject | undefined) => {
      pageName.value = options?.name
      pageType.value = options?.type
      pageChannelId.value = options?.channelId
      getDetailInfo()
      // const settingsMap: Record<string, Partial<typeof queryForm.value>> = {
      //   guaranteeZone: { bankId: '4114792dc83b41c1a63a441a3a3181c6' }, // 担保专区
      //   greenFinanceZone: { productMainType: '03' }, // 绿色金融专区
      //   technologyFinanceZone: { productMainType: '06' }, // 科技金融专区
      //   talentZone: { productMainType: '05' }, // 人才专区
      //   villageDevelopZone: { productMainType: '04' }, // 乡村振兴
      //   supplyChainFinance: { productMainType: '07' } // 供应链金融
      // }
      const settings: Record<string, string> = pageName.value === '担保专区' ? { bankId: pageType.value } : { productMainType: pageType.value }
      console.log('settings', settings)
      Object.assign(queryForm.value, settings)
      getListData(true)
      // 获取担保方式
      getGuaranteeMode()
    })
    return {
      previewImg,
      formatMode,
      pageName,
      htmlInfo,
      listData,
      loadMoreStatus,
      refresherTriggered,
      loginValidateRef,
      loginValidateType,
      CProductContrastRef,
      guaranteeModeList,
      scrolltolower,
      refresherrefresh,
      getMore,
      productDetailClick,
      collectionClick,
      applyClick,
      handleCompare
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
