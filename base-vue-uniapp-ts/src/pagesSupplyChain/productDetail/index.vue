<template lang="pug">
.page-view
  Layout(showHeaderBar showBack headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" :headerTitle="parentProductInfo.name")
    template(#main)
      view.layoutMain
        scroll-view.scrollView(scroll-y)
          .banner-wrap(:style="{ background: `url(${previewImg('wx_supplyChain_productDetailBannerBg')})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }")
            .tips {{ parentProductInfo.tips }}
          .mainContainer
            .centerMain
              .c-header
                image.product-logo(v-if="productDetail.logoFileId" :src="productDetail.logoUrl" mode="widthFix" :lazy-load="true" alt="")
                .c-title-box
                  view.title {{productDetail.name}}
                  view.subTitle {{productDetail.institutionsName}}
              view
                up-button.u-primary(@click="handleApply")
                  span.iconfont.icon-shenqing
                  span {{'我要申请'}}
              view.iconTitle
                span.iconfont.icon-chanpingeshao
                span {{'产品介绍'}}
              view {{productDetail.productDesc ? productDetail.productDesc : '暂无内容'}}
              view.line
              view.iconTitle
                span.iconfont.icon-shiyongqiahu
                span {{'适用客户'}}
              view {{productDetail.customerDesc ? productDetail.customerDesc : '暂无内容'}}
              view.line
              view.iconTitle
                span.iconfont.icon-shenqingtiaojian
                span {{'申请条件'}}
              view {{productDetail.entryCriteria ? productDetail.entryCriteria : '暂无内容'}}
            LoginValidateModal(ref='loginValidateRef' :type='loginValidateType')
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import { previewImg } from '@/util/utils'
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { finProductInfo } from '@/api/supplyChain'
import { externalLinkJump, linkJump } from '@/common/common'
import { userCommonStoreHook } from '@/store/modules/common'
import LoginValidateModal from '@/pages/user/loginValidateModal/index.vue'
import { fileDownload } from '@/api/index'
const parentProductInfo = ref({})
const productDetail = ref({})
// 登录token
let token = computed(() => {
  return userCommonStoreHook().token
})
let loginValidateType = ref('login')
let loginValidateRef = ref()

const getProductDetail = (productDetailId: string) => {
  finProductInfo(productDetailId).then(value => {
    let dataTemp = value.data
    dataTemp['logoUrl'] = dataTemp.logoFileId && fileDownload(dataTemp.logoFileId)
    productDetail.value = dataTemp
  })
}
// 我要申请
const handleApply = () => {
  if (!token.value) {
    loginValidateRef.value.init()
    return
  }
  if (
    [
      '623d2622f723477c90530769ae5b82e5',
      'c277c28ddaf34d8da6a2f3404764eafc',
      '0f3aec9cf59d48b28a3a858cc5fed9d0',
      '129150f01eba40d580bcd5086fcf342f',
      '0499188862874bffbadd127cd5ac5b71',
      'b1bfe97128204797a62adf2b11d10738'
    ].includes(productDetail.value.id)
  ) {
    linkJump(
      `/pagesSupplyChain/productApply/index?parentProductInfo=${encodeURIComponent(JSON.stringify(parentProductInfo.value))}&productInfo=${encodeURIComponent(JSON.stringify(productDetail.value))}`
    )
  } else {
    externalLinkJump(productDetail.value.applyUrl, productDetail.value.institutionsName)
  }
  // if (productDetail.value.code && productDetail.value.id) {
  //   // 产品申请判断
  //   let isConfig = productDetail.value.isConfig // 0开启1未开启
  //   let skipUrl = productDetail.value.skipUrl // 跳转地址
  //   if (isConfig == 0 && skipUrl) {
  //     externalLinkJump(skipUrl, productDetail.value.institutionsName)
  //   } else {
  //     linkJump(
  //       `/pagesSupplyChain/productApply/index?parentProductInfo=${encodeURIComponent(JSON.stringify(parentProductInfo.value))}&productInfo=${encodeURIComponent(JSON.stringify(productDetail.value))}`
  //     )
  //     // externalLinkJump(productDetail.value.applyUrl, productDetail.value.institutionsName)
  //   }
  // } else {
  //   linkJump(
  //     `/pagesSupplyChain/productApply/index?parentProductInfo=${encodeURIComponent(JSON.stringify(parentProductInfo.value))}&productInfo=${encodeURIComponent(JSON.stringify(productDetail.value))}`
  //   )
  // }
}
onLoad((options: AnyObject | undefined) => {
  let { parentProductInfo: parentProductInfoStr, productInfo: productInfoStr } = options ?? {}
  productDetail.value = JSON.parse(decodeURIComponent(productInfoStr) ?? '') ?? {}
  parentProductInfo.value = JSON.parse(decodeURIComponent(parentProductInfoStr) ?? '') ?? {}
  if (productDetail.value && productDetail.value.productDetailId) {
    getProductDetail(productDetail.value.productDetailId)
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
