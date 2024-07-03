<template lang="pug">
.page-view
  Layout(showTabBar)
    template(#main)
      .main-box
        scroll-view.srcoll-box(
          scroll-y
          @refresherrefresh='refresherrefresh'
          :refresher-enabled='true'
          :refresher-triggered='refresherTriggered'
        )
          //- 轮播图
          .carousel-container
            //- 不拉伸: aspectFit 拉伸填充: scaleToFill 默认保持纵横比: aspectFill
            u-swiper(v-if="carouselUrls.length" :list="carouselUrls" imgMode="scaleToFill" height="240" @click="carouseLinkClick")
          //- 常用服务
          .common-services
            CustomTitle(title="常用服务" icon="icon-remen" iconColor="#E23937")
            .services-main
              .services-item-box(v-for="(item, index) in commonServicesData" :key="index" @click="routerTabLink(item)")
                .icon-box(:class="item.class")
                  i.iconfont(:class="item.icon")
                .title {{ item.name }}
          //- 热门推荐
          .hot-recommendation
            CustomTitle(title="热门推荐" showMore @onClickMore="onRouterProduct('hot')")
            swiper(class="swiper" circular :indicator-dots="swiper.indicatorDots" :autoplay="swiper.autoplay" :interval="4000" :duration="swiper.duration")
              swiper-item(class="swiper-item" v-for="(item, index) in hotProductData" :key="index")
                .product-box(@click="productDetailClick(item)")
                  .product-tips
                    i.iconfont.icon-shigong
                    .title {{ item.companySource }}
                  .product-header
                    img(:src="item.logoUrl" alt="")
                    .title {{ item.name }}
                  .product-content
                    .product-data
                      .loan-limit-box.c-column
                        .value {{ item.loanLimit }}
                        .label {{ '贷款额度' }}
                      .rate-range-box.c-column
                        .value {{ item.rateRange }}
                        .label {{ '参考利率(年化)' }}
                      .loan-period-box.c-column
                        .value {{ item.loanPeriod }}
                        .label {{ '贷款期限' }}
                    .product-info
                      .guarantee-mode-box.c-row
                        .label {{ '担保方式：' }}
                        .value(v-if="item.guaranteeMode + ''") {{ formatMode(item.guaranteeMode, guaranteeModeList, item.guaranteeModeExtra) }}
                      //- .product-source-box.c-row
                      //-   .label {{ item.productSource }}
                  .product-footer
                    .product-tag
                      .tag-box(v-for="(tagItem, index) in getTabName(item)" :key="index" :class="tagItem.class")
                        .tag-name {{ tagItem.tag }}
                    .product-operation
                      .operation-box(@click.stop="collectionClick(item)")
                        i.iconfont(:class="item.isCollect ? 'icon-shouzanghou' : 'icon-shouzang'")
                      .operation-box(@click.stop="applyClick(item)")
                        i.iconfont.icon-shenqing
          //- 快贷产品
          .finance-products
            CustomTitle(title="快贷产品" showMore @onClickMore="onRouterProduct('productMainType')")
            swiper(class="swiper" circular :indicator-dots="swiper.indicatorDots" :autoplay="false" :duration="swiper.duration")
              swiper-item(class="swiper-item" v-for="(item, index) in productData" :key="index")
                .product-box.product-box-bak(@click="productDetailClick(item)")
                  .product-tips
                    i.iconfont.icon-shigong
                    .title {{ item.companySource }}
                  .product-header
                    img(:src="item.logoUrl" alt="")
                    .title {{ item.name }}
                  .product-content
                    .product-data
                      .loan-limit-box.c-column
                        .value {{ item.loanLimit }}
                        .label {{ '贷款额度' }}
                      .rate-range-box.c-column
                        .value {{ item.rateRange }}
                        .label {{ '参考利率(年化)' }}
                      .loan-period-box.c-column
                        .value(v-if="item.guaranteeMode + ''") {{ formatMode(item.guaranteeMode, guaranteeModeList, item.guaranteeModeExtra) }}
                        .label {{ '担保方式' }}
                  .product-footer
                    .product-data
                      .loan-period-box.c-column
                        .value {{ item.loanPeriod }}
                        .label {{ '贷款期限' }}
                    .product-operation
                      .operation-box(@click.stop="collectionClick(item)")
                        i.iconfont(:class="item.isCollect ? 'icon-shouzanghou' : 'icon-shouzang'")
                      .operation-box(@click.stop="applyClick(item)")
                        i.iconfont.icon-shenqing
          //- 鄂融通数据统计
          .statistics-container
            CustomTitle(title="鄂融通数据")
            .statistics-main
              .statistics-enterprises(:style="{ backgroundImage: `url(${enterprisesNumData.background})` }")
                .value(:style="{ color: enterprisesNumData.valueColor }") {{ enterprisesNumData.count }}
                .label {{ `${enterprisesNumData.name}(${enterprisesNumData.unit})` }}
              .statistics-data
                .stats-box(v-for="(item, index) in statisticsData" :key="index" :style="{ backgroundImage: `url(${item.background})` }")
                  .value(:style="{ color: item.valueColor }") {{ item.count }}
                  .label {{ `${item.name}(${item.unit})` }}
          //- 说明
          .explain-container
            img(:src="preview(imgConstant['wx_index_explain'])" alt="")
            u-button(type="primary" shape="circle" @click="aboutHandleClick")
              span.txt {{ '查看详情' }}
              u-icon(name="arrow-right")
          CFooter
        LoginValidateModal(ref='loginValidateRef' :type='loginValidateType')
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import type { Ref } from 'vue'
import Layout from '@/components/layout/index.vue'
import CustomTitle from '@/components/custom-title/index.vue'
import CFooter from '@/components/c-footer/index.vue'
import LoginValidateModal from '@/pages/user/loginValidateModal/index.vue'
import { fileDownload, carouselImgList, carouselProductList, countDisplay } from '@/api/index'
import type { ApiResponse } from '@/common/http/types'
import type { CarouselImgItem, DictListItem } from '@/api/index/types'
import type { ProductListItem } from '@/api/financeProduct/types'
import { formatMode } from '@/util/utils'
import { userCommonStoreHook } from '@/store/modules/common'
import { linkJump } from '@/common/common'
import { handleJudgeCollection, productApplyHandle } from '@/hooks/common'
import { preview } from '@/api/common/index'
import imgConstant from '@/common/imgConstant'
import Bus, { POLICYTYPE, REFRESH } from '@/common/bus'
interface CommonServicesItem {
  id: string
  name: string
  icon: string
  class: string
  url: string
}
export default defineComponent({
  name: 'Login',
  components: { Layout, CustomTitle, CFooter, LoginValidateModal },
  setup(props, context) {
    const commonStoreHook = userCommonStoreHook()
    // 下拉刷新状态
    const refresherTriggered = ref<boolean>(true)
    const guaranteeModeList: Ref<DictListItem[]> = ref([])
    // 轮播图
    const carouselData: Ref<CarouselImgItem[]> = ref([])
    const carouselUrls: Ref<Array<string>> = ref([])
    const swiper = reactive({
      indicatorDots: false, // 显示面板指示点
      autoplay: true, // 自动切换
      duration: 500 // 滑动动画时长
    })
    // 常用服务
    const commonServicesData: CommonServicesItem[] = reactive([
      {
        id: '0',
        name: '金融产品',
        icon: 'icon-jinrongchanpin',
        class: 'finance-product',
        url: '/pages/financeProduct/index'
      },
      {
        id: '1',
        name: '征信服务',
        icon: 'icon-zhengxinfuwu',
        class: 'credit-report-services',
        url: '/pagesIndex/creditReportService/index'
      },
      {
        id: '2',
        name: '合作机构',
        icon: 'icon-hezuojigou',
        class: 'cooper-institution',
        url: '/pagesIndex/cooperativeInstitution/index'
      },
      {
        id: '3',
        name: '政策文件',
        icon: 'icon-zhengcewenjian',
        class: 'policy-file',
        url: '/pages/policyNews/index'
      }
    ])
    // 热门产品
    const hotProductData: Ref<ProductListItem[]> = ref([])
    // 快贷产品
    const productData: Ref<ProductListItem[]> = ref([])
    const enterprisesNumData = reactive({
      key: 'enterprisesNumSum',
      name: '入库企业',
      count: 0,
      unit: '家',
      valueColor: '#2A79D4',
      background: preview(imgConstant['wx_index_enterprisesNumSum'])
    })
    const statisticsData = reactive([
      {
        key: 'loanAmoutSum',
        name: '放款总额',
        count: 0,
        unit: '万元',
        valueColor: '#E38616',
        background: preview(imgConstant['wx_index_loanAmoutSum'])
      },
      {
        key: 'institutionNumSum',
        name: '入驻机构',
        count: 0,
        unit: '家',
        valueColor: '#AA3FBF',
        background: preview(imgConstant['wx_index_institutionNumSum'])
      },
      {
        key: 'productsNumSum',
        name: '金融产品',
        count: 0,
        unit: '项',
        valueColor: '#34A680',
        background: preview(imgConstant['wx_index_productsNumSum'])
      },
      {
        key: 'loanNumSum',
        name: '放款总数',
        count: 0,
        unit: '笔',
        valueColor: '#4F80EF',
        background: preview(imgConstant['wx_index_loanNumSum'])
      }
    ])
    // 产品申请
    const { loginValidateRef, loginValidateType, jumpLoginFn, linkProductApply } = productApplyHandle()
    // 获取担保方式
    const getGuaranteeMode = async () => {
      const result: DictListItem[] = await commonStoreHook.getDict('guarantee_type')
      guaranteeModeList.value = result
    }
    // 获取轮播图
    const getCarouselList = () => {
      carouselImgList().then((result: ApiResponse<CarouselImgItem[]>) => {
        carouselData.value = result.data
        // h5
        // carouselUrls.value = result.data.filter(item => item.mobileCarouselFileId).map((item: CarouselImgItem) => item.mobileCarouselFileId && fileDownload(item.mobileCarouselFileId))
        // 小程序
        carouselUrls.value = result.data.filter(item => item.appletsCarouselFileId).map((item: CarouselImgItem) => item.appletsCarouselFileId && fileDownload(item.appletsCarouselFileId))
      })
    }
    // 轮播图点击
    const carouseLinkClick = (index: string) => {
      console.log('轮播图点击', index)
    }
    // 通用跳转
    const routerLink = (url: string) => {
      if (!url) return
      linkJump(url)
    }
    // 常用服务跳转
    const routerTabLink = (item: CommonServicesItem) => {
      switch (item.class) {
        case 'finance-product':
          commonStoreHook.setTabBar(1, '金融产品')
          break
        case 'credit-report-services':
          routerLink(item.url)
          break
        case 'cooper-institution':
          routerLink(item.url)
          break
        case 'policy-file':
          Bus.$emit(POLICYTYPE, 'policyGuide')
          commonStoreHook.setTabBar(2, '政策新闻')
        default:
          break
      }
    }
    // 获取热门/快贷产品
    const getProductList = (type: string) => {
      /**
       * 热门产品-hot: 1
       * 政策产品-productMainType: 01
       * 快贷产品-productMainType: 02
       */
      let params: { isApplets?: string; page: number; limit: number; hot?: string; productMainType?: string } = {
        isApplets: '1', // 代表是否是小程序轮播图，固定传 "1"，代表是
        page: 1,
        limit: 15
      }
      if (type === 'hot') {
        // params.hot = '1'
        params.productMainType = '08'
      }
      if (type === 'productMainType') {
        // params.productMainType = '01'
        params.productMainType = '09'
      }
      carouselProductList(params).then((result: ApiResponse<ProductListItem[]>) => {
        let data = result.page
        data.list.map((item: ProductListItem) => {
          item['logoUrl'] = item.logoFileId && fileDownload(item.logoFileId)
          item['companySource'] = '本产品由' + item.institutionsName + '提供'
          item['loanPeriod'] = item.loanPeriodBegin === 0 ? item.loanPeriodEnd + '个月及以下' : item.loanPeriodBegin + '-' + item.loanPeriodEnd + '个月'
          item['rateRange'] = item.rateRangeBegin + '%-' + item.rateRangeEnd + '%'
          item['loanLimit'] = item.loanLimitBegin + '~' + item.loanLimitEnd + '万元'
          item['productSource'] = '产品来源：' + item.institutionsName
          item['isCollect'] = item.whetherCollection + '' === '0' ? true : false
          // item['characteristics'] = '高富帅,白富美,富富富'
        })
        if (type === 'hot') {
          hotProductData.value = data.list
        } else if (type === 'productMainType') {
          productData.value = data.list
        }
      })
    }
    const getTabName = (item: ProductListItem) => {
      if (!item.characteristics) return false
      return item.characteristics.split(',').map((childItem: string, itemIndex: number) => {
        return { tag: childItem, class: `tag${itemIndex + 1}` }
      })
    }
    // 产品收藏
    const collectionClick = async (item: ProductListItem) => {
      if (!item.id) return
      if (!jumpLoginFn()) return
      // 收藏
      handleJudgeCollection('1', item, (isCollect: boolean) => {
        item.isCollect = isCollect
      })
    }
    // 产品申请
    const applyClick = async (item: ProductListItem) => {
      linkProductApply(item)
    }
    // 获取数据统计
    const getStatisticsData = () => {
      countDisplay().then((result: ApiResponse<any>) => {
        let data: AnyObject = result.data
        enterprisesNumData.count = data[enterprisesNumData.key]
        for (let i = 0; i < statisticsData.length; i++) {
          statisticsData[i].count = data[statisticsData[i].key]
        }
      })
    }
    // 查看更多
    const onRouterProduct = (type: string) => {
      linkJump(`/pagesIndex/indexProduct/index?type=${type === 'hot' ? '08' : '09'}`)
    }
    // 产品详情
    const productDetailClick = (item: ProductListItem) => {
      linkJump(`/pagesFinanceProduct/productDetail/index?id=${item.id}`)
    }
    // 关于鄂融通
    const aboutHandleClick = () => {
      linkJump('/pagesUser/about/index')
    }
    // 下拉刷新
    const refresherrefresh = () => {
      refresherTriggered.value = true
      refreshData()
    }
    // 刷新
    const refreshData = () => {
      try {
        // 获取担保方式
        getGuaranteeMode()
        // 获取轮播图
        getCarouselList()
        // 获取热门产品
        getProductList('hot')
        // 获取快贷产品
        getProductList('productMainType')
        // 获取数据统计
        getStatisticsData()
        setTimeout(() => {
          refresherTriggered.value = false
        }, 50)
      } catch (error) {
        setTimeout(() => {
          refresherTriggered.value = false
        }, 50)
        console.log('error', error)
      }
    }
    onMounted(() => {
      // 获取担保方式
      getGuaranteeMode()
      // 获取轮播图
      getCarouselList()
      // 获取热门产品
      getProductList('hot')
      // 获取快贷产品
      getProductList('productMainType')
      // 获取数据统计
      getStatisticsData()
      // 刷新
      Bus.$on(REFRESH, (flag: boolean) => {
        refreshData()
      })
    })
    return {
      commonStoreHook,
      refresherTriggered,
      guaranteeModeList,
      carouselUrls,
      commonServicesData,
      swiper,
      hotProductData,
      productData,
      enterprisesNumData,
      statisticsData,
      loginValidateRef,
      loginValidateType,
      preview,
      imgConstant,
      formatMode,
      carouseLinkClick,
      routerLink,
      routerTabLink,
      getTabName,
      collectionClick,
      applyClick,
      onRouterProduct,
      productDetailClick,
      aboutHandleClick,
      refresherrefresh
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
