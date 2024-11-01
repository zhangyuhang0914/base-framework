<template lang="pug">
.page-view
  Layout(showHeaderBar showBack headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" headerTitle="核心企业")
    template(#main)
      .enterprise-info-wrap
        scroll-view.scroll-view(scroll-y)
          .banner-wrap(:style="{ background: `url(${previewImg('wx_supplyChain_coreEnterpriseBannerBg')})`, backgroundSize: '100%', backgroundRepeat: 'no-repeat' }")
            .name {{ '供应链核心企业' }}
          .c-content-box
            .content-wrap
              .c-content(v-if="enterpriseInfo && enterpriseInfo.name")
                .c-common-header
                  image.c-img(:src="previewImg('wx_supplyChain_coreEnterpriseTitleRight')" mode="widthFix" :lazy-load="true" alt="")
                  .title {{ enterpriseInfo.name }}
                  image.c-img(:src="previewImg('wx_supplyChain_coreEnterpriseTitleLeft')" mode="widthFix" :lazy-load="true" alt="")
                .company-text(v-if="enterpriseInfo.content1")
                  CRich(:content='enterpriseInfo.content1')
                .company-text(v-if="enterpriseInfo.content2")
                  CRich(:content='enterpriseInfo.content2')
                image.c-img(v-if="enterpriseInfo.logoImg1" :src="previewImg(enterpriseInfo.logoImg1)" mode="widthFix" :lazy-load="true" alt="")
                .company-text(v-if="enterpriseInfo.content3")
                  CRich(:content='enterpriseInfo.content3')
                .company-text(v-if="enterpriseInfo.content4")
                  CRich(:content='enterpriseInfo.content4')
                .company-text(v-if="enterpriseInfo.content5")
                  CRich(:content='enterpriseInfo.content5')
                image.c-img(v-if="enterpriseInfo.logoImg2" :src="previewImg(enterpriseInfo.logoImg2)" mode="widthFix" :lazy-load="true" alt="")
                .company-text(v-if="enterpriseInfo.content6")
                  CRich(:content='enterpriseInfo.content6')
                CustomTitle.custom-title(title="联系方式" v-if="enterpriseInfo.addressList && enterpriseInfo.addressList.length")
                .c-address-info(v-if="enterpriseInfo.addressList && enterpriseInfo.addressList.length")
                  .c-address-item(v-for="(item, index) in enterpriseInfo.addressList" :key="index")
                    .c-item-title {{ item.name }}
                    .c-address-wrap
                      .c-content-item-box
                        image.c-icon(v-if="item.address" :src="previewImg(enterpriseInfo.addressIcon)" mode="widthFix" :lazy-load="true" alt="")
                        .c-content-item-text {{ item.address }}
                      .c-content-item-box
                        image.c-icon(v-if="item.phone" :src="previewImg(enterpriseInfo.phoneIcon)" mode="widthFix" :lazy-load="true" alt="")
                        .c-content-item-text(@click.capture="callPhoneClick(item.phone)") {{ item.phone }}
                      .c-content-item-box
                        image.c-icon(v-if="item.mail" :src="previewImg(enterpriseInfo.emailIcon)" mode="widthFix" :lazy-load="true" alt="")
                        .c-content-item-text {{ item.mail }}
                u-button.u-primary(type="primary" v-if="enterpriseInfo.url" @click="toLink(enterpriseInfo.url)") {{ '点击复制官网链接' }}
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Layout from '@/components/layout/index.vue'
import CRich from '@/components/c-rich/index.vue'
import CustomTitle from '@/components/custom-title/index.vue'
import { onLoad } from '@dcloudio/uni-app'
import { previewImg } from '@/util/utils'
import { setClipboardData } from '@/common/common'
import { useCallPhone } from '@/hooks/common'

export default defineComponent({
  name: 'EnterpriseDetail',
  components: { Layout, CRich, CustomTitle },
  setup(props) {
    const enterpriseInfo = ref({})
    const callPhoneClick = (phone: string) => {
      useCallPhone(
        phone,
        () => {},
        error => {
          console.log('error', error)
        }
      )
    }
    const toLink = (url: string) => {
      setClipboardData(url)
    }
    onLoad((options: AnyObject | undefined) => {
      let { enterpriseInfo: enterpriseInfoStr } = options ?? {}
      enterpriseInfo.value = JSON.parse(decodeURIComponent(enterpriseInfoStr) ?? '') ?? {}
      console.log('onLoad', options, enterpriseInfo.value)
    })
    return {
      previewImg,
      enterpriseInfo,
      callPhoneClick,
      toLink
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
