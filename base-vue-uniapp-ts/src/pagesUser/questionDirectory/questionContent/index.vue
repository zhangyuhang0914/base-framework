<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack statusBackground="#132B5B" headerBackground="#132B5B" headerColor="#FFFFFF" :headerTitle="title")
    template(#main)
      view.layoutMain
        .mainContainer
          scroll-view.scrollView(
            scroll-y
            :refresher-enabled='true'
            :refresher-triggered='refresherTriggered'
            @refresherrefresh='refresherrefresh'
          )
            .content
              CRich(:content='detailInfo.content')
              CAttachment(v-if='detailInfo.fileList && detailInfo.fileList.length' :attachmentList='detailInfo.fileList')
            u-loadmore(v-if="loadMoreStatus !== 'nomore'" :status="loadMoreStatus")
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue'
import Layout from '@/components/layout/index.vue'
import CRich from '@/components/c-rich/index.vue'
import CAttachment from '@/components/c-attachment/index.vue'
import { cmsInfo } from '@/api/index/index'
import { decode } from '@/util/base64'
import { onLoad } from '@dcloudio/uni-app'
import type { ApiResponse } from '@/common/http/types'
import type { CmsInfoResponseType } from '@/api/index/types'

export default defineComponent({
  name: 'QuestionContent',
  components: { Layout, CRich, CAttachment },
  setup() {
    const id = ref<string>('')
    const title = ref<string>('')
    const detailInfo: Ref<CmsInfoResponseType | object> = ref<CmsInfoResponseType | object>({})
    // LoadMore组件状态：loadmore查看更多 loading加载中 nomore没有更多
    const loadMoreStatus = ref<string>('loadmore')
    // 下拉刷新状态
    const refresherTriggered = ref<boolean>(false)
    // 获取详情信息
    const getDetailInfo = (id: string) => {
      if (!id) return
      loadMoreStatus.value = 'loading'
      detailInfo.value = {}
      cmsInfo(id)
        .then((result: ApiResponse<CmsInfoResponseType>) => {
          let data = result.data || {}
          data.content = decode(data.content)
          detailInfo.value = data
        })
        .catch(reason => {
          console.error(reason)
        })
        .finally(() => {
          // 若为最后一页 则 return,没有更多
          loadMoreStatus.value = 'nomore'
          refresherTriggered.value = false
        })
    }
    // 下拉刷新
    const refresherrefresh = () => {
      refresherTriggered.value = true
      getDetailInfo(id.value)
    }
    onLoad((options: any) => {
      id.value = options?.id
      title.value = options?.title
      getDetailInfo(id.value)
    })
    return {
      title,
      detailInfo,
      loadMoreStatus,
      refresherTriggered,
      refresherrefresh
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
