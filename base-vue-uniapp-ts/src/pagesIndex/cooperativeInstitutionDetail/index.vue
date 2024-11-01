<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" headerTitle="机构详情")
    template(#main)
      .layout-main
        .main-container
          .institution-detail-main
            scroll-view.scroll-view(
              scroll-y
              :refresher-enabled='true'
              :refresher-triggered='refresherTriggered'
              @scrolltolower="scrolltolower"
              @refresherrefresh='refresherrefresh'
            )
              .detail-main
                .header-detail
                  img.logo-img(:src="detailInfo.logoUrl" alt="")
                  .header-title-box
                    .title {{ detailInfo.bankName }}
                    .institutions-name {{ detailInfo.bankFullName }}
                .content-main
                  CustomTitle(title="机构介绍")
                  .customer-intro(v-if="detailInfo.intro" :class="{ 'active-txt': textMoreStatus }") {{ detailInfo.intro }}
                  CNoData(v-else :showImg="false")
                  u-button.custom-btn.u-pinia-btn(v-if="detailInfo.intro" type="primary" @click="txtMoreHandle") {{ textMoreStatus ? '查看更多' : '收起' }}
                  CustomTitle(:title="getInstitutionName()")
                  .institution-list(v-if="institutionList.length")
                    .institution-item(v-for="(item, index) in institutionList" :key="index")
                      .values-box
                        .label {{ '网点名称：' }}
                        .value {{ item.name }}
                      .values-box
                        .label {{ '营业时间：' }}
                        .value {{ item.workTimeDesc }}
                      u-button.custom-btn.u-pinia-btn(type="primary" @click="productLook(item)") {{ '查看' }}
                  CNoData(v-else :showImg="false")
                  u-loadmore(:status="loadMoreStatus" @loadmore="getMore")
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import Layout from '@/components/layout/index.vue'
import CustomTitle from '@/components/custom-title/index.vue'
import { onLoad } from '@dcloudio/uni-app'
import { preview } from '@/api/common/index'
import imgConstant from '@/common/imgConstant'
import { fileDownload, institutionsBankInfo, institutionsByIdList } from '@/api/index'
import type { ApiResponse } from '@/common/http/types'
import type { BankListItem } from '@/api/financeProduct/types'
import type { InstitutionsByIdListParam, InstitutionsListItem } from '@/api/index/types'
import type { PageItem } from '@/api/index/types'
import { linkJump } from '@/common/common'

export default defineComponent({
  name: 'CooperativeInstitutionDetail',
  components: { Layout, CustomTitle },
  setup(props) {
    const id = ref<string>('')
    const cityCode = ref<string>('')
    const cityName = ref<string>('')
    const detailInfo = ref<BankListItem | object>({})
    const institutionList = ref<InstitutionsListItem[]>([])
    // LoadMore组件状态：loadmore查看更多 loading加载中 nomore没有更多
    const loadMoreStatus = ref<string>('loadmore')
    // 下拉刷新状态
    const refresherTriggered = ref<boolean>(false)
    const page = reactive<PageItem>({
      currentPage: 1,
      pageSize: 10,
      totalPage: 0
    })
    const textMoreStatus = ref<boolean>(true)
    // 滚动到底部刷新
    const scrolltolower = () => {
      if (loadMoreStatus.value === 'loadmore') {
        // 若此时可以加载更多才触发，避免频繁触底发起请求
        getMore()
      }
    }
    // 下拉刷新
    const refresherrefresh = () => {
      refresherTriggered.value = true
      getInstitutionDetail()
      getInstitutionsByIdList(true)
    }
    // 点击加载更多或是scroll-view组件触底加载更多
    const getMore = () => {
      if (loadMoreStatus.value !== 'loadmore') {
        return
      }
      // 加载下一页
      page.currentPage = page.currentPage + 1
      getInstitutionsByIdList()
    }
    // 查询机构详情
    const getInstitutionDetail = () => {
      if (!id.value) return
      institutionsBankInfo(id.value).then((result: ApiResponse<BankListItem>) => {
        let data = result.data
        data['logoUrl'] = data.logoFileId && fileDownload(data.logoFileId)
        detailInfo.value = data
      })
    }
    // 查询分支机构列表
    const getInstitutionsByIdList = (reset = false) => {
      // 重置页码
      if (reset) {
        page.currentPage = 1
        institutionList.value = []
      }
      let params: InstitutionsByIdListParam = {
        page: page.currentPage,
        limit: page.pageSize,
        finInstitutionsBankId: id.value,
        cityCode: cityCode.value
      }
      institutionsByIdList(params)
        .then((result: ApiResponse<InstitutionsListItem[]>) => {
          let data = result.page
          if (data.currPage === 1 && data.totalCount === 0 && data.totalPage === 0) {
            // 暂无数据
            institutionList.value = []
          } else {
            institutionList.value = institutionList.value.concat(data.list || [])
          }
          page.totalPage = data.totalPage || 0
        })
        .finally(() => {
          if (page.currentPage === page.totalPage) {
            // 若为最后一页 则 return,没有更多
            loadMoreStatus.value = 'nomore'
          } else {
            loadMoreStatus.value = 'loadmore'
          }
          refresherTriggered.value = false
        })
    }
    const txtMoreHandle = () => {
      textMoreStatus.value = !textMoreStatus.value
    }
    // 获取机构名称
    const getInstitutionName = () => {
      return cityName.value ? `分支机构-${cityName.value}` : '分支机构'
    }
    // 查看
    const productLook = (item: InstitutionsListItem) => {
      if (!item.id) return
      linkJump('/pagesIndex/institutionPrudoctList/index?institutionsId=' + item.id)
    }
    onMounted(() => {
      // 查询机构详情
      getInstitutionDetail()
      // 查询分支机构列表
      getInstitutionsByIdList()
    })
    onLoad((options: any) => {
      id.value = options.id
      cityCode.value = options.cityCode
      cityName.value = options.cityName
    })
    return {
      preview,
      imgConstant,
      detailInfo,
      institutionList,
      loadMoreStatus,
      refresherTriggered,
      textMoreStatus,
      scrolltolower,
      refresherrefresh,
      getMore,
      txtMoreHandle,
      getInstitutionName,
      productLook
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
