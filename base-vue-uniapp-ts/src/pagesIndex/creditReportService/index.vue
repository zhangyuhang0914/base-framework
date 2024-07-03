<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#DAECFE" statusBackground="#DAECFE" headerTitle="征信服务")
    template(#main)
      view.layoutMain
        .mainContainer
          view.serviveMain
            view.topTab
              view.tabItem(v-for='item in tabList' :key='item.id' :class="{hover: item.id === currentTabId}" @click="handleTabType(item)")
                view.iconBox
                  view.iconfont(:class='item.icon')
                view.text-line1-overflow {{item.title}}
            .scrollContent(v-if='tabList.length')
              scroll-view.scroll-view(scroll-y)
                .content
                  CRich(:content='detailInfo.content')
                  CAttachment(v-if='detailInfo.fileList && detailInfo.fileList.length' :attachmentList='detailInfo.fileList')
            CNoData(v-else)
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import { onMounted, ref } from 'vue'
import { queryPublishListByType, cmsInfo } from '@/api/policyNews/index'
import CRich from '@/components/c-rich/index.vue'
import { decode } from '@/util/base64'
import CNoData from '@/components/c-no-data/index.vue'
let detailInfo = ref({})
const tabList = ref([])
const currentTabId = ref('')
// 切换tab
const handleTabType = (item: AnyObject) => {
  currentTabId.value = item.id
  getDetailInfo(item.id)
}
let iconList = ['icon-templatemagt', 'icon-task', 'icon-information', 'icon-wenjian1']
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
    limit: '4',
    typeCode: 'ZXFW'
  }
  queryPublishListByType(params)
    .then(value => {
      let data = value.data
      let list = data.list || []
      list.forEach((item, index) => {
        item.icon = iconList[index]
      })
      tabList.value = list
      if (tabList.value.length) {
        handleTabType(tabList.value[0])
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
