<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#DAECFE" statusBackground="#DAECFE" headerTitle="政策新闻")
    template(#main)
      view.layoutMain
        scroll-view.mainContainer(scroll-y)
          view.content
            view.doctitle {{info.title}}
            view.timeBox
              text {{moment(info.publishTime).format('YYYY-MM-DD HH:mm')}}
              text.publisher {{info.source}}
              view.fontSizeBox
                view {{'字号'}}
                view.btnGroup
                  view(
                    v-for="item in fontSizeTypeList"
                    :key="item.value"
                    :class="{btn: true, active: item.value === fontSizeType}"
                    @click="changeFontSize(item)") {{item.name}}
            view.line
            view(:class="{[fontSizeType]: true}")
              CRich(:content='info.content')
            CAttachment(v-if='info.fileList && info.fileList.length' :attachmentList='info.fileList')
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import Layout from '@/components/layout/index.vue'
import { reactive, ref } from 'vue'
import moment from 'moment/moment'
import { cmsInfo, platformConsultationUrl } from '@/api/policyNews'
import CRich from '@/components/c-rich/index.vue'
import { decode } from '@/util/base64'
import CAttachment from '@/components/c-attachment/index.vue'
let query = ref({})
let info = ref({
  title: '',
  publishTime: '',
  source: '',
  content: ''
})
let fontSizeTypeList = reactive([
  {
    name: '大',
    value: 'large'
  },
  {
    name: '中',
    value: 'normal'
  },
  {
    name: '小',
    value: 'mini'
  }
])
let fontSizeType = ref('normal')
// 获取详情信息
const getDetailInfo = () => {
  let params: any = {}
  let api
  if (query.value.type === 'policyGuide' || query.value.type === 'news') {
    api = cmsInfo
  }
  if (query.value.type === 'platformConsultation') {
    params = {
      rqsMsgBdy: `{'operType':'queryPageXq' ,'unitId': 'ERT00001', 'crawlId': '${query.value.id}', 'page': '0', 'size': '10'}`
    }
    api = platformConsultationUrl
  }
  if (!api) {
    return
  }
  api(params, query.value.id)
    .then(value => {
      let data = {}
      if (query.value.type === 'policyGuide' || query.value.type === 'news') {
        data = value.data
        data.content = decode(data.content)
      }
      if (query.value.type === 'platformConsultation') {
        let list = JSON.parse(value.rest_MsgBdy_Cntnt || '[]')
        data = list.length ? list[0] : {}
        data.publishTime = data.updatedTimeStr
        data.source = data.webName || data.newsDerivation || '飞驰e智平台'
      }
      // 去掉html里面设置字体大小的样式
      data.content = data.content.replaceAll('font-size', 'font-siz')
      info.value = data
    })
    .catch(reason => {
      console.error(reason)
    })
}
// 切换字体大小
const changeFontSize = (item: AnyObject) => {
  fontSizeType.value = item.value
}
onLoad((option: AnyObject | undefined) => {
  query.value = option
  getDetailInfo()
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
