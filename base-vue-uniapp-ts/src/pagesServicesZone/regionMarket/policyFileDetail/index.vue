<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" headerTitle="政策文件")
    template(#main)
      view.layoutMain
        scroll-view.mainContainer(scroll-y)
          view.content
            view.doctitle {{info.doctitle}}
            view.timeBox
              text {{moment(info.pubdate).format('YYYY-MM-DD HH:mm')}}
              text.publisher {{info.publisher}}
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
              CRich(:content='info.dochtmlcon')
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import Layout from '@/components/layout/index.vue'
import { reactive, ref } from 'vue'
import moment from 'moment/moment'
import CRich from '@/components/c-rich/index.vue'
import { technologyFinance } from '@/api/servicesZone'
import type { ITechnologyFinanceItem } from '@/api/servicesZone/type'
let query = ref({
  financeId: ''
})
let info = ref<ITechnologyFinanceItem>({})
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
  technologyFinance(query.value.financeId)
    .then(value => {
      let data = value.data
      let fileNum = data.filenum ? `<p class="text-center mb-2" style="text-indent: 0;"><strong>${data.filenum}</strong></p>` : ''
      data.dochtmlcon = `${fileNum}${data.dochtmlcon}`
      // 去掉html里面设置字体大小的样式
      data.dochtmlcon = data?.dochtmlcon?.replaceAll('font-size', 'font-siz')
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
  query.value.financeId = option?.financeId
  getDetailInfo()
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
