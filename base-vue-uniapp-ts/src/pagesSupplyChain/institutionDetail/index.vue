<template lang="pug">
.page-view
  Layout(showHeaderBar showBack headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" headerTitle="机构详情")
    template(#main)
      .institution-info-wrap
        scroll-view.scroll-view(scroll-y)
          .banner-wrap(:style="{ background: `url(${previewImg('wx_supplyChain_institutionDetailBannerBg')})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }")
            .tips-box
              .name {{ institutionInfo.name }}
              .title {{ '权威专区' }} &nbsp;&nbsp; {{ '融资报告' }}
              .tips {{ '助您了解投融市场风向标' }}
          .c-content-box
            .content-wrap
              .c-content(v-if="institutionInfo.name")
                //- 机构简介
                .c-title(v-if="institutionInfo.companyContent")
                  image.c-title-logo.c-company-img(:src="previewImg('wx_supplyChain_institutionDetailCompany')" mode="widthFix" :lazy-load="true" alt="")
                CRich.company-text(v-if="institutionInfo.companyContent" :content='institutionInfo.companyContent')
                //- 产品与服务
                .c-title(v-if="institutionInfo.productService.length")
                  image.c-title-logo.c-services-img(:src="previewImg('wx_supplyChain_institutionDetailService')" mode="widthFix" :lazy-load="true" alt="")
                .product-services-wrap
                  .service-item(v-for="(item, index) in institutionInfo.productService" :key="index")
                    .service-item-logo
                      image.c-service-item-logo-img(:src="previewImg(item.imgBgConstant)" mode="widthFix" :lazy-load="true" alt="")
                    .service-item-title {{ item.name }}
                    .service-item-content {{ item.content }}
                //- 功能优势
                .c-title(v-if="institutionInfo.functionAntages.length")
                  image.c-title-logo.c-antages-img(:src="previewImg('wx_supplyChain_institutionDetailAntages')" mode="widthFix" :lazy-load="true" alt="")
                .function-antages-wrap(:class="getRowsClass")
                  .function-antages-item(v-for="(item, index) in institutionInfo.functionAntages" :key="index" :class="{ 'function-antages-item-active': index === functionAntagesActive }" @click="functionAntagesItemClick(index)" :style="{ background: `url(${previewImg(item.imgBgConstant)})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', backgroundPosition: '100% 100%' }")
                    .function-antages-name(v-if="index !== functionAntagesActive") {{ item.name }}
                    .function-antages-box(v-else)
                      .function-antages-title {{ item.name }}
                      .function-antages-content {{ item.content }}
                //- 合作机构
                //- 联系方式
                .c-title
                  image.c-title-logo.c-info-img(:src="previewImg('wx_supplyChain_institutionDetailInfo')" mode="widthFix" :lazy-load="true" alt="")
                .cooperative-us
                  .cooperative-us-item(v-if="institutionInfo.addressInfo.address")
                    .cooperative-us-img
                      image.cooperative-us-address(:src="previewImg('wx_supplyChain_institutionDetailAddress')" mode="widthFix" :lazy-load="true" alt="")
                    CRich.cooperative-us-text(:content='institutionInfo.addressInfo.address')
                  .cooperative-us-item(v-if="institutionInfo.addressInfo.time || institutionInfo.addressInfo.phone")
                    .cooperative-us-img
                      image.cooperative-us-phone(:src="previewImg('wx_supplyChain_institutionDetailPhone')" mode="widthFix" :lazy-load="true" alt="")
                    .cooperative-us-text-box
                      .cooperative-us-text
                        CRich(:content='institutionInfo.addressInfo.time')
                      .cooperative-us-text(@click.capture="callPhoneClick")
                        CRich(:content='institutionInfo.addressInfo.phone')
                  .cooperative-us-item(v-if="institutionInfo.addressInfo.mail")
                    .cooperative-us-img
                      image.cooperative-us-mail(:src="previewImg('wx_supplyChain_institutionDetailEmail')" mode="widthFix" :lazy-load="true" alt="")
                    CRich.cooperative-us-text(:content='institutionInfo.addressInfo.mail')
                .institution-logo
                  image.institution-qr-code(v-if="institutionInfo.imgLogoConstant" :src="previewImg(institutionInfo.imgLogoConstant)" @click="handlePreview(institutionInfo.imgLogoConstant)" mode="widthFix" :lazy-load="true" alt="")
                u-button.u-primary(type="primary" v-if="institutionInfo.url" @click="toLink(institutionInfo.url)") {{ '点击复制官网链接' }}
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from 'vue'
import Layout from '@/components/layout/index.vue'
import CRich from '@/components/c-rich/index.vue'
import { onLoad } from '@dcloudio/uni-app'
import { previewImg } from '@/util/utils'
import { setClipboardData } from '@/common/common'
import { useCallPhone } from '@/hooks/common'
import { FinanceInstitutionDataType } from '../index/types'

export default defineComponent({
  name: 'InstitutionDetail',
  components: { Layout, CRich },
  setup(props) {
    const institutionInfo: Ref<FinanceInstitutionDataType | null> = ref<FinanceInstitutionDataType | null>(null)
    const functionAntagesActive = ref(0)
    const functionAntagesItemClick = (index: number) => {
      functionAntagesActive.value = index
    }
    const callPhoneClick = () => {
      useCallPhone(
        (institutionInfo.value as FinanceInstitutionDataType).addressInfo.phone,
        () => {},
        error => {
          console.log('error', error)
        }
      )
    }
    // 预览图片
    const handlePreview = (url: string) => {
      const tempFilePaths: Ref = ref(previewImg(url))
      uni.previewImage({
        urls: [tempFilePaths.value],
        loop: true,
        success: function (res) {},
        fail: () => {
          uni.$u.toast('图片预览失败')
        }
      })
    }
    const toLink = (url: string) => {
      setClipboardData(url)
    }
    const getRowsClass = computed(() => {
      if (institutionInfo.value && institutionInfo.value.functionAntages) {
        if (institutionInfo.value.functionAntages.length >= 6) {
          return 'rows-3'
        } else if (institutionInfo.value.functionAntages.length <= 4) {
          return 'rows-2'
        } else if (institutionInfo.value.functionAntages.length <= 2) {
          return 'rows-1'
        }
      }
      return 'rows-3'
    })
    onLoad((options: AnyObject | undefined) => {
      let { institutionInfo: institutionInfoStr } = options ?? {}
      institutionInfo.value = JSON.parse(decodeURIComponent(institutionInfoStr) ?? '') ?? {}
      console.log('onLoad', options, institutionInfo.value)
    })
    return {
      previewImg,
      institutionInfo,
      functionAntagesActive,
      getRowsClass,
      functionAntagesItemClick,
      callPhoneClick,
      handlePreview,
      toLink
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
