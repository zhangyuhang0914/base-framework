<template lang="pug">
.page-view
  CFilterSearch(:visiable="exceSearchShow" headerColor="#FFFFFF")
  Layout(showTabBar)
    template(#main)
      .main-box
        scroll-view.scroll-view(
          scroll-y
          @scroll="onScroll"
          @refresherrefresh='refresherrefresh'
          :refresher-enabled='true'
          :refresher-triggered='refresherTriggered'
        )
          .scroll-box
            //- 轮播图
            .carousel-container
              //- 不拉伸: aspectFit 拉伸填充: scaleToFill 默认保持纵横比: aspectFill
              u-swiper(v-if="carouselUrls.length" :list="carouselUrls" imgMode="aspectFill" height="230" @click="carouseLinkClick")
            .page-content
              //- 常用服务
              .common-services
                .services-item-box(v-for="(item, index) in commonServicesData" :key="index" @click="routerTabLink(item)")
                  .icon(:class="[ item.imgUrl, item.class ]")
                  .title {{ item.name }}
              //- 热门推荐
              .hot-recommendation
                .custom-product-header(:style="{ background: `url(${previewImg('wx_index_hotRecommendation')})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }")
                  .c-handle-box
                    .c-title {{ '热门推荐' }}
                    i.iconfont.icon-remen
                  .c-more(@click="onRouterProduct('hot')")
                    span.more {{ '查看更多' }}
                    u-icon.icon-right(name="arrow-right" color="#ADB0B9" size="14")
                swiper(class="swiper" @change="hotChange" circular :indicator-dots="swiper.indicatorDots" :autoplay="swiper.autoplay" :interval="4000" :duration="swiper.duration")
                  swiper-item(class="swiper-item" v-for="(item, index) in hotProductData" :key="index")
                    .product-box.hot-products-box(@click="productDetailClick(item)")
                      .product-tips(v-if="item.guaranteeMode + ''" :style="{ background: `url(${previewImg('wx_index_producGuaranteeMode')})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }")
                        .title {{ formatMode(item.guaranteeMode, guaranteeModeList, item.guaranteeModeExtra) }}
                      .product-header
                        .product-title
                          .name.text-line2-overflow {{ item.name }}
                        .img-logo
                          image(:src="item.logoUrl" mode="heightFix" :lazy-load="true" alt="")
                          //- .source {{ item.companySource }}
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
                      //- .product-footer
                      //-   .operation-box.pinia-btn(@click.stop="collectionClick(item)")
                      //-     i.iconfont(:class="item.isCollect ? 'icon-shouzanghou' : 'icon-shouzang'")
                      //-     span.value {{ '加入收藏' }}
                      //-   .operation-box.primary-btn(@click.stop="applyClick(item)")
                      //-     i.iconfont.icon-shenqing
                      //-     span.value {{ '我要申请' }}
                .indicator
                  .dot(v-for="(item, index) in hotProductData" :key="index" :class="{ active: index === hotActiveIndex }")
              u-button(type="primary" @click="handleFileUpload") {{ '测试H5文件上传' }}
              //- 服务专区
              .service-zone-container
                image.zone-img(:src="previewImg('wx_index_servicesZone')" @click="supplyChainCenterClick" mode="widthFix" :lazy-load="true" alt="")
              //- 主要类型产品
              .main-type-product
                .main-product-module
                  .custom-tab-wrap
                    up-tabs(
                      :current="currentMainType"
                      lineColor="linear-gradient(180deg, #F2D279, #F9EBB0)"
                      :list="productTypeList"
                      :lineWidth="45"
                      :lineHeight="6"
                      :inactiveStyle="{color: '#132B5B', fontSize: '32rpx', fontWeight: 'bold'}"
                      :activeStyle="{color: '#DA251D', fontSize: '32rpx', fontWeight: 'bold'}"
                      :itemStyle="{width: '30%', height: '100rpx', padding: '5rpx'}"
                      @click="handleTabType")
                  .main-product-wrap(v-if="productTypeList[currentMainType] && productTypeList[currentMainType].list && productTypeList[currentMainType].list.length")
                    swiper(class="swiper" @change="mainTypeProductChange" circular :indicator-dots="swiper.indicatorDots" :autoplay="false" :duration="swiper.duration")
                      swiper-item(class="swiper-item" v-for="(item, index) in productTypeList[currentMainType].list" :key="index")
                        .main-product-box
                          .main-product-card(v-for="(product, productIndex) in item" :key="productIndex" @click="productDetailClick(product)")
                            .main-product-header
                              image.img-logo(:src="product.logoUrl" mode="widthFix" :lazy-load="true" alt="")
                            .main-product-content
                              .product-title.text-line1-overflow {{ product.name }}
                              .rate-range-box.c-column {{ product.rateRange }}
                    .indicator
                      .dot(v-for="(item, index) in productTypeList[currentMainType].list" :key="index" :class="{ active: index === mainProductActiveIndex }")
                  .no-data-view(v-else)
                    CNoData(:showImg="false")
              //- 鄂融通数据统计
              .statistics-container
                .statistics-main(:style="{ background: `url(${previewImg('wx_index_statistics')})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }")
                  .explain-container
                    .explain-logo(:style="{ background: `url(${previewImg('wx_index_statisticsTips')})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }")
                    u-button(type="primary" shape="circle" @click="aboutHandleClick")
                      span.txt {{ '查看详情' }}
                      u-icon(name="arrow-right")
                  .c-line
                  .statistics-data
                    .stats-box(v-for="(item, index) in statisticsData" :key="index")
                      .value {{ item.count }}
                      .label {{ `${item.name}(${item.unit})` }}
              CFooter
        LoginValidateModal(ref='loginValidateRef' :type='loginValidateType')
</template>

<script lang="ts">
import { defineComponent, nextTick, reactive, ref } from 'vue'
import type { Ref } from 'vue'
import Layout from '@/components/layout/index.vue'
import CFilterSearch from '@/components/c-filter-search/index.vue'
import CustomTitle from '@/components/custom-title/index.vue'
import CFooter from '@/components/c-footer/index.vue'
import CNoData from '@/components/c-no-data/index.vue'
import LoginValidateModal from '@/pages/user/loginValidateModal/index.vue'
import { fileDownload, carouselImgList, carouselProductList, countDisplay } from '@/api/index'
import type { ApiResponse } from '@/common/http/types'
import type { CarouselImgItem, DictListItem } from '@/api/index/types'
import type { ProductListItem } from '@/api/financeProduct/types'
import { formatMode, previewImg } from '@/util/utils'
import { userCommonStoreHook } from '@/store/modules/common'
import { externalLinkJump, linkJump } from '@/common/common'
import { handleJudgeCollection, productApplyHandle } from '@/hooks/common'
import Bus, { POLICYTYPE, REFRESH } from '@/common/bus'
import { productInfoList } from '@/api/financeProduct'
import { onLoad, onShow } from '@dcloudio/uni-app'
interface CommonServicesItem {
  id: string
  name: string
  imgUrl: string
  class: string
  url: string
}
export default defineComponent({
  name: 'Login',
  components: { Layout, CFilterSearch, CustomTitle, CFooter, CNoData, LoginValidateModal },
  setup(props, context) {
    const commonStoreHook = userCommonStoreHook()
    // 下拉刷新状态
    const refresherTriggered = ref<boolean>(false)
    const guaranteeModeList: Ref<DictListItem[]> = ref([])
    // 轮播图
    const carouselData: Ref<CarouselImgItem[]> = ref([])
    const carouselUrls: Ref<Array<string>> = ref([])
    const swiper = reactive({
      indicatorDots: false, // 显示面板指示点
      autoplay: false, // 自动切换
      duration: 500 // 滑动动画时长
    })
    const hotActiveIndex = ref(0)
    const hotChange: UniHelper.SwiperOnChange = e => {
      hotActiveIndex.value = e.detail.current
    }
    const mainProductActiveIndex = ref(0)
    const mainTypeProductChange: UniHelper.SwiperOnChange = e => {
      mainProductActiveIndex.value = e.detail.current
    }
    // 常用服务
    const commonServicesData: CommonServicesItem[] = reactive([
      {
        id: '0',
        name: '征信服务',
        imgUrl: 'icon-zhengxinfuwu-1',
        class: 'credit-report-services',
        url: '/pagesIndex/creditReportService/index'
      },
      {
        id: '1',
        name: '合作机构',
        imgUrl: 'icon-hezuojigou-1',
        class: 'cooper-institution',
        url: '/pagesIndex/cooperativeInstitution/index'
      },
      // {
      //   id: '2',
      //   name: '服务专区',
      //   imgUrl: 'icon-jinrongchanpin-1',
      //   class: 'finance-product',
      //   url: ''
      // },
      {
        id: '3',
        name: '政策新闻',
        imgUrl: 'icon-zhengcewenjian-1',
        class: 'policy-file',
        url: '/pagesIndex/policyNews/index'
      }
    ])
    // 热门产品
    const hotProductData: Ref<ProductListItem[]> = ref([])
    // 主要类型产品
    const productTypeList: Ref<DictListItem[]> = ref([])
    const currentMainType = ref(0)
    const statisticsData = reactive([
      {
        key: 'enterprisesNumSum',
        name: '入库企业',
        count: 0,
        unit: '家',
        valueColor: '#2A79D4'
      },
      {
        key: 'loanAmoutSum',
        name: '放款总额',
        count: 0,
        unit: '万元',
        valueColor: '#E38616'
      },
      {
        key: 'institutionNumSum',
        name: '入驻机构',
        count: 0,
        unit: '家',
        valueColor: '#AA3FBF'
      },
      {
        key: 'productsNumSum',
        name: '金融产品',
        count: 0,
        unit: '项',
        valueColor: '#34A680'
      },
      {
        key: 'loanNumSum',
        name: '放款总数',
        count: 0,
        unit: '笔',
        valueColor: '#4F80EF'
      }
    ])
    // 检索组件
    const exceSearchShow = ref(true)
    // 产品申请
    const { loginValidateRef, loginValidateType, jumpLoginFn, linkProductApply } = productApplyHandle()
    // 获取担保方式
    const getGuaranteeMode = async () => {
      const result: DictListItem[] = await commonStoreHook.getDict('guarantee_type')
      guaranteeModeList.value = result
    }
    // 获取主要产品类型
    const getProductType = async () => {
      let result: DictListItem[] = await commonStoreHook.getDict('product_main_type')
      result = result
        .filter((item: DictListItem) => item.value.indexOf('H') === -1)
        .map((item: DictListItem) => {
          return { ...item, list: [] }
        })
      productTypeList.value = result.filter(item => item.value.indexOf('H') === -1)
      console.log('getProductType', productTypeList.value)
      // 获取主要类型产品
      getProductMainTypeList()
    }
    // 切换产品类型
    const handleTabType = (item: AnyObject) => {
      console.log('handleTabType', item)
      currentMainType.value = item.index
      !productTypeList.value[currentMainType.value].list?.length && getProductMainTypeList()
    }
    const onScroll = (event: UniHelper.ScrollViewOnScrollEvent) => {
      exceSearchShow.value = event.detail.scrollTop < 30
    }
    // 获取轮播图
    const getCarouselList = () => {
      carouselImgList().then((result: ApiResponse<CarouselImgItem[]>) => {
        carouselData.value = result.data
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
          routerLink(item.url)
          nextTick(() => {
            Bus.$emit(POLICYTYPE, 'policyGuide')
          })
      }
    }
    // 获取热门/快贷产品
    const getProductList = (type: string) => {
      /**
       * 热门产品-productMainType: 08
       * 政策产品-productMainType: 01
       * 快贷产品-productMainType: 02
       */
      let params: { isApplets?: string; page: number; limit: number; hot?: string; productMainType?: string } = {
        isApplets: '1', // 代表是否是小程序轮播图，固定传 "1"，代表是
        page: 1,
        limit: 5
      }
      if (type === 'hot') {
        params.productMainType = '08'
      }
      carouselProductList(params).then((result: ApiResponse<ProductListItem[]>) => {
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
        if (type === 'hot') {
          hotProductData.value = data.list
        }
      })
    }
    // 获取产品列表
    const getProductMainTypeList = () => {
      let params = {
        dockingFlag: '0', // 过滤市州产品
        isApplets: '1',
        page: 1,
        limit: 6,
        dkje: '', // 贷款金额
        dkqx: '', // 贷款期限
        guaranteeMode: '', // 担保方式
        bank_id: '', // 金融机构
        city_code: '', // 所在区域
        name: '', // 产品名称
        productMainType: productTypeList.value[currentMainType.value].value, // 产品类型
        fin_institutions_info_id: '', // 产品机构id
        sidx: 'pubdate',
        order: 'desc'
      }
      productInfoList(params).then((result: ApiResponse<ProductListItem[]>) => {
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
        productTypeList.value[currentMainType.value].list = splitArr(data.list, 2) ?? []
      })
    }
    // 分割数组
    const splitArr = (arr: ProductListItem[], size: number): Array<ProductListItem[]> => {
      if (arr.length === 0) return []
      const result: Array<ProductListItem[]> = []
      for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size))
      }
      return result
    }
    // 产品收藏
    const collectionClick = async (item: ProductListItem) => {
      if (!item.id) return
      if (!jumpLoginFn()) return
      // 收藏
      handleJudgeCollection('1', item, (isCollect: boolean) => {
        item.isCollect = isCollect
        Bus.$emit(REFRESH, true)
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
        for (let i = 0; i < statisticsData.length; i++) {
          statisticsData[i].count = data[statisticsData[i].key]
        }
        console.log('statisticsData', result, statisticsData)
      })
    }
    // 查看更多
    const onRouterProduct = (type: string) => {
      linkJump(`/pagesIndex/indexProduct/index?type=${type === 'hot' ? '08' : '09'}`)
    }
    // 产品详情
    const productDetailClick = (item: ProductListItem) => {
      linkJump(`/pagesFinanceProduct/productDetail/index?id=${item.id}&isCollect=${item.isCollect}`)
    }
    // 供应链金融服务中心
    const supplyChainCenterClick = () => {
      linkJump('/pagesSupplyChain/index/index')
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
    // 测试文件上传
    const handleFileUpload = () => {
      // externalLinkJump('http://localhost:8082/jgd/', '测试H5文件上传')
      // externalLinkJump('https://jrb.hubei.gov.cn/szxqyxyxx/institution/login.html', '测试H5文件上传')
      externalLinkJump('https://jrb.hubei.gov.cn/zfxxgk_GK2020/fdzdgknr_GK2020/qtzdgknr_GK2020/jytabl_GK2020/rdjy_GK2020/', '测试H5文件上传')
    }
    // 刷新
    const refreshData = () => {
      try {
        // 获取担保方式
        getGuaranteeMode()
        // 获取主要产品类型
        getProductType()
        // 获取轮播图
        getCarouselList()
        // 获取热门产品
        getProductList('hot')
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
    // 隐藏小程序后会自动销毁
    onShow(() => {
      // 刷新
      Bus.$on(REFRESH, (flag: boolean) => {
        refreshData()
      })
    })
    onLoad(() => {
      // 获取担保方式
      getGuaranteeMode()
      // 获取主要产品类型
      getProductType()
      // 获取轮播图
      getCarouselList()
      // 获取热门产品
      getProductList('hot')
      // 获取数据统计
      getStatisticsData()
    })
    return {
      commonStoreHook,
      refresherTriggered,
      guaranteeModeList,
      productTypeList,
      currentMainType,
      carouselUrls,
      commonServicesData,
      swiper,
      hotActiveIndex,
      hotChange,
      hotProductData,
      mainProductActiveIndex,
      mainTypeProductChange,
      exceSearchShow,
      statisticsData,
      loginValidateRef,
      loginValidateType,
      previewImg,
      formatMode,
      carouseLinkClick,
      handleTabType,
      onScroll,
      routerLink,
      routerTabLink,
      collectionClick,
      applyClick,
      onRouterProduct,
      productDetailClick,
      supplyChainCenterClick,
      aboutHandleClick,
      refresherrefresh,
      handleFileUpload
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
