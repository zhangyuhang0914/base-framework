<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack statusBackground="#132B5B" headerBackground="#132B5B" headerColor="#FFFFFF" headerTitle="常见问题")
    template(#main)
      scroll-view.scroll-view(
        scroll-y
        @refresherrefresh='refresherrefresh'
        :refresher-enabled='true'
        :refresher-triggered='refresherTriggered'
      )
        up-collapse(:value="currentActive" @change="collapseChange" @close="collapseClose" @open="collapseOpen")
          up-collapse-item(
            v-for="(item, index) in categoryCollapseList"
            :key="index"
            :title="item.chName"
            :name="item.id"
          )
            .slot-collapse-item(v-for="(childItem, childIndex) in item.CMSInfoList" :key="childIndex" @click="CMSContentLook(childItem, item)")
              text.text {{ childItem.title }}
              u-icon.icon-jiantou-you(name="arrow-right" color="#909399" size="16")
        u-loadmore(v-if="loadMoreStatus !== 'nomore'" :status="loadMoreStatus")
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, type Ref } from 'vue'
import Layout from '@/components/layout/index.vue'
import { cmsCategoryListByPid, cmsInfoDataList } from '@/api/index'
import { CMSCategoryLevelItemType, CMSInfoDataListItemType } from '@/api/index/types'
import type { ApiResponse } from '@/common/http/types'
import { linkJump } from '@/common/common'
import { PageItem } from '@/api/user/type'

export default defineComponent({
  name: 'questionDirectory',
  components: { Layout },
  setup(props) {
    // LoadMore组件状态：loadmore查看更多 loading加载中 nomore没有更多
    const loadMoreStatus = ref<string>('loadmore')
    // 下拉刷新状态
    const refresherTriggered = ref<boolean>(false)
    const page = reactive<PageItem>({
      currentPage: 1,
      pageSize: 30,
      totalPage: 0
    })
    const infoListPage = reactive<PageItem>({
      currentPage: 1,
      pageSize: 30,
      totalPage: 0
    })
    const currentActive = ref<string[]>([])
    const categoryCollapseList: Ref<CMSCategoryLevelItemType[]> = ref([])
    // 下拉刷新
    const refresherrefresh = () => {
      refresherTriggered.value = true
      getCmsCategoryListByPid(true)
    }
    // 查询分类栏目列表
    const getCmsCategoryListByPid = (reset = false) => {
      // 重置页码
      if (reset) {
        page.currentPage = 1
        categoryCollapseList.value = []
      }
      let params = {
        page: page.currentPage,
        limit: page.pageSize,
        sidx: '',
        order: 'desc',
        // 常见问题id: 10023
        pid: 10023
      }
      loadMoreStatus.value = 'loading'
      cmsCategoryListByPid(params)
        .then((result: ApiResponse<CMSCategoryLevelItemType[]>) => {
          const data = result.page.list.filter((item: CMSCategoryLevelItemType) => item.isVisual !== 0) || []
          categoryCollapseList.value = data
          const promises = categoryCollapseList.value.map((item: CMSCategoryLevelItemType) => {
            return getCmsInfoDataList(item)
          })
          Promise.all(promises).then(() => {
            currentActive.value = categoryCollapseList.value.map((item: CMSCategoryLevelItemType) => {
              return item.id
            })
          })
          page.totalPage = result.page.totalPage || 0
        })
        .finally(() => {
          // 若为最后一页 则 return,没有更多
          loadMoreStatus.value = page.currentPage === page.totalPage ? 'nomore' : 'loadmore'
          refresherTriggered.value = false
        })
    }
    // 查询分类栏目下列表数据
    const getCmsInfoDataList = (item: CMSCategoryLevelItemType): Promise<void> => {
      return new Promise((resolve, reject) => {
        let params = {
          page: infoListPage.currentPage,
          limit: infoListPage.pageSize,
          sidx: '',
          order: 'desc',
          dataStatus: 1,
          categoryId: item.id,
          title: '',
          publishTime: ''
        }
        cmsInfoDataList(params)
          .then((result: ApiResponse<CMSInfoDataListItemType[]>) => {
            item['CMSInfoList'] = result.page.list || []
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    }
    const collapseChange = (activeNames: string | string[]) => {
      console.log('collapseChange', activeNames)
    }
    const collapseClose = (activeNames: string | string[]) => {
      console.log('collapseOpen', activeNames)
    }
    const collapseOpen = (activeNames: string | string[]) => {
      console.log('collapseOpen', activeNames)
    }
    const CMSContentLook = (childItem: CMSInfoDataListItemType, item: CMSCategoryLevelItemType) => {
      linkJump('/pagesUser/questionDirectory/questionContent/index?id=' + childItem.id + '&title=' + item.chName)
    }
    onMounted(() => {
      getCmsCategoryListByPid()
    })
    return {
      loadMoreStatus,
      refresherTriggered,
      currentActive,
      categoryCollapseList,
      refresherrefresh,
      collapseChange,
      collapseClose,
      collapseOpen,
      CMSContentLook
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
