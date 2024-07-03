<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#DAECFE" statusBackground="#DAECFE" headerTitle="关于鄂融通")
    template(#main)
      view.layoutMain
        .mainContainer
          scroll-view.scrollView(scroll-y)
            img.topImg(:src="preview(imgConstant.wx_user_about)" alt="")
            .content
              CRich(:content='detailInfo.content')
              CAttachment(v-if='detailInfo.fileList && detailInfo.fileList.length' :attachmentList='detailInfo.fileList')
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import { ref, onMounted } from 'vue'
import { cmsInfo, queryPublishListByType } from '@/api/policyNews'
import { decode } from '@/util/base64'
import CRich from '@/components/c-rich/index.vue'
import { preview } from '@/api/common'
import imgConstant from '@/common/imgConstant'
let detailInfo = ref({})
// 获取详情信息
const getDetailInfo = (id: string) => {
  let params: AnyObject = {}
  cmsInfo(params, id)
    .then(value => {
      let data = value.data || {}
      data.content = decode(data.content)
      detailInfo.value = data
    })
    .catch(reason => {
      console.error(reason)
    })
}
// 获取列表数据
const getListData = () => {
  let params: any = {
    page: '1',
    limit: '1',
    typeCode: 'GYERT'
  }
  queryPublishListByType(params)
    .then(value => {
      let data = value.data
      let list = data.list || []
      if (list.length) {
        getDetailInfo(list[0].id)
      }
    })
    .catch(reason => {
      console.error(reason)
    })
}
onMounted(() => {
  getListData()
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
