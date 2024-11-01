<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" headerTitle="服务专区")
    template(#main)
      scroll-view.scroll-view(
        scroll-y
        :refresher-enabled='true'
        :refresher-triggered='refresherTriggered'
        @refresherrefresh='refresherrefresh'
      )
        .services-zone-wrap
          image.banner-img(:src="previewImg('wx_index_servicesZone')" @click="supplyChainCenterClick" mode="widthFix" :lazy-load="true" alt="")
          .zone-list
            .zone-item(
              :class=`[
                {'talentZone': item.specialZoneName === '人才专区'},
                {'villageDevelopZone': item.specialZoneName === '乡村振兴'}]`
              v-for="(item, index) in servicesZoneList"
              :key="index"
              @click.capture="zoneLinkClick(item)"
            )
              image.zone-logo(:src="preview(item.mobileCarouselFileId)" mode="widthFix" :lazy-load="true" alt="")
              .zone-item-title {{ item.specialZoneName }}
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, type Ref } from 'vue'
import Layout from '@/components/layout/index.vue'
import { previewImg } from '@/util/utils'
import { preview } from '@/api/common'
import { linkJump, openOtherApp } from '@/common/common'
import { specialZoneList } from '@/api/servicesZone'
import type { SpecialZoneItem } from '@/api/servicesZone/type'
import type { ApiResponse } from '@/common/http/types'

export default defineComponent({
  name: 'ServicesZone',
  components: { Layout },
  setup(props) {
    // const servicesZoneList = reactive([
    //   {
    //     id: '0',
    //     channelId: '100091',
    //     name: '担保专区',
    //     type: 'guaranteeZone',
    //     pageType: 'common',
    //     logoUrl: 'wx_servicesZone_guaranteeZoneLogo',
    //     url: '/pagesServicesZone/commonZone/index'
    //   },
    //   {
    //     id: '1',
    //     channelId: '100089',
    //     name: '绿色金融专区',
    //     type: 'greenFinanceZone',
    //     pageType: 'common',
    //     logoUrl: 'wx_servicesZone_greenFinanceZoneLogo',
    //     url: '/pagesServicesZone/commonZone/index'
    //   },
    //   {
    //     id: '2',
    //     name: '区域性股权市场',
    //     type: 'regionShareholdMarket',
    //     pageType: 'personAlization',
    //     logoUrl: 'wx_servicesZone_regionShareholdMarketLogo',
    //     url: '/pagesServicesZone/regionMarket/index'
    //   },
    //   {
    //     id: '3',
    //     name: '楚天贷款码',
    //     type: 'trukingLoanCode',
    //     pageType: 'qrCode',
    //     logoUrl: 'wx_servicesZone_trukingLoanCodeLogo',
    //     url: 'https://newbms.hkbchina.com/pboc-loan/#/'
    //   },
    //   {
    //     id: '4',
    //     name: '荆楚融担码',
    //     type: 'rongdanCode',
    //     pageType: 'miniApp',
    //     logoUrl: 'wx_servicesZone_rongdanCodeLogo',
    //     appId: 'wxfae897b3e0b9453b',
    //     path: ''
    //   },
    //   {
    //     id: '5',
    //     channelId: '100090',
    //     name: '科技金融',
    //     type: 'technologyFinanceZone',
    //     pageType: 'common',
    //     logoUrl: 'wx_servicesZone_technologyFinanceZoneLogo',
    //     url: '/pagesServicesZone/commonZone/index'
    //   },
    //   {
    //     id: '6',
    //     channelId: '100088',
    //     name: '人才专区',
    //     type: 'talentZone',
    //     pageType: 'common',
    //     logoUrl: 'wx_servicesZone_talentZoneLogo',
    //     url: '/pagesServicesZone/commonZone/index'
    //   },
    //   {
    //     id: '7',
    //     channelId: '100093',
    //     name: '乡村振兴',
    //     type: 'villageDevelopZone',
    //     pageType: 'common',
    //     logoUrl: 'wx_servicesZone_villageDevelopZoneLogo',
    //     url: '/pagesServicesZone/commonZone/index'
    //   },
    //   {
    //     id: '8',
    //     channelId: '100092',
    //     name: '供应链金融',
    //     type: 'supplyChainFinance',
    //     pageType: 'common',
    //     logoUrl: 'wx_servicesZone_supplyChainFinanceLogo',
    //     url: '/pagesServicesZone/commonZone/index'
    //   },
    //   {
    //     id: '9',
    //     name: '飞驰e智',
    //     type: 'ifaCcb',
    //     pageType: 'miniApp',
    //     logoUrl: 'wx_servicesZone_ifaCcbLogo',
    //     appId: 'wx17712b021981258e',
    //     path: 'pages/index/index'
    //   }
    // ])
    // 下拉刷新状态
    const refresherTriggered = ref<boolean>(false)
    const servicesZoneList = ref<SpecialZoneItem[]>([])
    // 下拉刷新
    const refresherrefresh = () => {
      refresherTriggered.value = true
      getSpecialZoneList()
    }
    const getSpecialZoneList = () => {
      specialZoneList()
        .then((result: ApiResponse<SpecialZoneItem[]>) => {
          servicesZoneList.value = result.data.filter((item: SpecialZoneItem) => item.isShowApp === '0') || []
        })
        .finally(() => {
          refresherTriggered.value = false
        })
    }
    // 供应链金融服务中心
    const supplyChainCenterClick = () => {
      linkJump('/pagesSupplyChain/index/index')
    }
    // specialZoneType - 0：通用专区  1：股权市场  2：二维码  3：小程序
    const zoneLinkClick = (item: SpecialZoneItem) => {
      switch (item.specialZoneType) {
        case '0':
          linkJump(`/pagesServicesZone/commonZone/index?name=${item.specialZoneName}&type=${item.productMainType}&channelId=${item.channelId}`)
          break
        case '1':
          linkJump('/pagesServicesZone/regionMarket/index')
          break
        case '2':
          const tempFilePaths: Ref = ref(preview(item.mobileCarouselFileId))
          uni.previewImage({
            urls: [tempFilePaths.value],
            loop: true,
            success: function (res) {},
            fail: () => {
              uni.$u.toast('图片预览失败')
            }
          })
          break
        case '3':
          openOtherApp(item.appId as string, item.appLinkUrl)
          break
        default:
          uni.$u.toast('未知专区类型，请联系管理员！')
      }
    }
    onMounted(() => {
      getSpecialZoneList()
    })
    return {
      previewImg,
      preview,
      refresherTriggered,
      servicesZoneList,
      refresherrefresh,
      supplyChainCenterClick,
      zoneLinkClick
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
