<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" headerTitle="合作机构")
    template(#main)
      .finance-institution
        .institution-filter-wrap
          CustomTitle(title="金融机构筛选" headerColor="#FFFFFF")
          .filter-main
            span.txt {{ '请选择 地区/机构' }}
            .operation-btn
              .expand-filter(@click="openFilter")
                .txt {{ '展开筛选' }}
                u-icon(:name="filterShow ? 'arrow-up' : 'arrow-down'")
              .close-filter(@click="resetHandle")
                .txt {{ '清空筛选' }}
        .institution-scroll-content
          scroll-view.scroll-view(
            scroll-y
            :refresher-enabled='true'
            :refresher-triggered='refresherTriggered'
            @scrolltolower="scrolltolower"
            @refresherrefresh='refresherrefresh'
          )
            .scroll-box(v-if="listData.length")
              //- # 后期优化-数据太多使用虚拟列表
              .scroll-item(v-for="(item, index) in listData" :key="index")
                .institution-box
                  .product-header
                    .product-logo
                      image(:src="item.logoUrl" mode="widthFix" :lazy-load="true" alt="")
                    .product-name {{ item.bankName }}
                  .product-info
                    .institution-info
                      .info
                        i.iconfont.icon-fuwuwangdian
                        .txt {{ '入驻网点' }}
                        .value {{ item.institutionNum }}
                      .info
                        i.iconfont.icon-chanpin
                        .txt {{ '发布产品' }}
                        .value {{ item.productNum }}
                    .product-operation
                      u-button.u-primary-btn(type="primary" @click="institutionLook(item)") {{ '查看机构' }}
              u-loadmore(:status="loadMoreStatus" @loadmore="getMore")
            .no-data-view(v-else)
              CNoData
          up-popup.filter-popup(:show="filterShow" @close="filterShow = false" mode="bottom" :round="10")
            .popup-header
              .title {{ '全部筛选' }}
              .popup-close(@click="filterShow = false")
                u-icon(name="close")
            .popup-content
              scroll-view.scroll-view(scroll-y)
                .tips-title
                  .txt {{ '所在区域' }}
                .area-main.form-check
                  .value-item(
                    v-for="(item, index) in areaList"
                    :key="index"
                    @click="handleChangeCheck(item.name, item.code, 'area')"
                    :class="{ 'is-active': activeClass(item.name, item.code, 'area'), 'auto-width': item.name.length > 5 }"
                  ) {{ item.name }}
                .tips-title
                  .txt {{ '金融机构' }}
                  .open(@click="isExpand")
                    .show-txt {{ showBank ? '展开' : '收起' }}
                    u-icon(v-if="showBank" name="arrow-down")
                    u-icon(v-else name="arrow-up")
                .product-bank-main.form-check(:class="{ 'is-hide': showBank }")
                  .value-item(
                    v-for="(item, index) in bankAllList"
                    :key="index"
                    @click="handleChangeCheck(item.bankName, item.code, 'productBank')"
                    :class="{ 'is-active': activeClass(item.bankName, item.code, 'productBank'), 'auto-width': item.bankName.length > 5 }"
                  ) {{ item.bankName }}
            .popup-footer
              u-button.reset-btn.u-info-btn(type="info" shape="circle" @click="resetHandle") {{ '重 置' }}
              u-button.confirm-btn.u-primary-btn(type="primary" shape="circle" @click="confirmHandle") {{ getInstitutionCount }}
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, type Ref } from 'vue'
import Layout from '@/components/layout/index.vue'
import CustomTitle from '@/components/custom-title/index.vue'
import CNoData from '@/components/c-no-data/index.vue'
import type { PageItem } from '@/components/c-product-list/type'
import type { AreaInListItem, BankListItem } from '@/api/financeProduct/types'
import type { InstitutionQueryParams } from './types'
import { joinArr } from '@/util/utils'
import { fileDownload, institutionsBankList } from '@/api/index'
import type { ApiResponse } from '@/common/http/types'
import { areaInList, bankFindAll } from '@/api/financeProduct'
import { linkJump } from '@/common/common'

export default defineComponent({
  name: 'CooperativeInstitution',
  components: { Layout, CustomTitle, CNoData },
  setup(props) {
    const listData = ref<BankListItem[]>([])
    // LoadMore组件状态：loadmore查看更多 loading加载中 nomore没有更多
    const loadMoreStatus = ref<string>('loadmore')
    // 下拉刷新状态
    const refresherTriggered = ref<boolean>(false)
    const page = reactive<PageItem>({
      currentPage: 1,
      pageSize: 10,
      totalPage: 0
    })
    const institutionCount = ref<number>(0)
    const filterShow = ref(false)
    const areaList: Ref<AreaInListItem[]> = ref([]) // 所在区域
    const bankAllList: Ref<BankListItem[]> = ref([]) // 金融机构
    const showBank = ref(true)
    // 存储筛选条件
    const queryForm: InstitutionQueryParams = reactive({
      cityCode: '', // 所在区域
      cityName: '', // 所在区域名称
      bankCodeList: [] // 金融机构
    })
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
      getListData(true)
    }
    // 点击加载更多或是scroll-view组件触底加载更多
    const getMore = () => {
      if (loadMoreStatus.value !== 'loadmore') {
        return
      }
      // 加载下一页
      page.currentPage = page.currentPage + 1
      getListData()
    }
    // 获取金融机构列表
    const getListData = (reset = false) => {
      // 重置页码
      if (reset) {
        page.currentPage = 1
        listData.value = []
      }
      let params = {
        page: page.currentPage,
        limit: page.pageSize,
        cityCode: queryForm.cityCode,
        bankCodeList: joinArr(queryForm.bankCodeList)
      }
      loadMoreStatus.value = 'loading'
      institutionsBankList(params)
        .then((result: ApiResponse<BankListItem[]>) => {
          let data = result.page
          data.list.map((item: BankListItem) => {
            item['logoUrl'] = item.logoFileId && fileDownload(item.logoFileId)
          })
          if (data.currPage === 1 && data.totalCount === 0 && data.totalPage === 0) {
            // 暂无数据
            listData.value = []
          } else {
            listData.value = listData.value.concat(data.list || [])
          }
          page.totalPage = data.totalPage || 0
          institutionCount.value = data.totalCount || 0
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
    // 获取所在区域
    const getAreaInData = () => {
      areaInList({}).then((result: ApiResponse<AreaInListItem[]>) => {
        areaList.value = result.data
      })
    }
    // 获取区域名称
    const getCityName = (code: string): string | unknown => {
      if (!code) return
      const area = areaList.value.find(item => item.code === code)
      return area ? area.name : ''
    }
    // 获取金融机构
    const getBankAllData = () => {
      bankFindAll({}).then((result: ApiResponse<BankListItem[]>) => {
        bankAllList.value = result.data
      })
    }
    // 查看机构
    const institutionLook = (item: BankListItem) => {
      linkJump('/pagesIndex/cooperativeInstitutionDetail/index?id=' + item.id + '&cityCode=' + queryForm.cityCode + '&cityName=' + queryForm.cityName)
    }
    // 打开筛选
    const openFilter = () => {
      filterShow.value = !filterShow.value
    }
    // 展开/折叠 机构
    const isExpand = () => {
      showBank.value = !showBank.value
    }
    // 列表筛选选中激活
    const activeClass = computed(() => (name: string, id: string, type: string) => {
      if (type === 'productBank') {
        if (queryForm.bankCodeList && queryForm.bankCodeList.indexOf(id) > -1) {
          return true
        }
      } else if (type === 'area') {
        if (queryForm.cityCode && queryForm.cityCode === id) {
          return true
        }
      }
    })
    // 列表筛选选中
    const handleChangeCheck = (name: string, id: string, type: string) => {
      if (type === 'productBank') {
        if (queryForm.bankCodeList.indexOf(id) > -1) {
          let index = queryForm.bankCodeList.indexOf(id)
          queryForm.bankCodeList.splice(index, 1)
        } else {
          queryForm.bankCodeList.push(id)
        }
      } else if (type === 'area') {
        if (queryForm.cityCode === id) {
          queryForm.cityCode = ''
          queryForm.cityName = ''
        } else {
          queryForm.cityCode = id
          queryForm.cityName = getCityName(queryForm.cityCode) as string
        }
      }
      getListData(true)
    }
    // 重置
    const resetHandle = () => {
      queryForm.cityCode = ''
      queryForm.cityName = ''
      queryForm.bankCodeList = []
      getListData(true)
      filterShow.value = false
    }
    // 查看机构
    const confirmHandle = () => {
      filterShow.value = false
    }
    // 获取机构数量
    const getInstitutionCount = computed(() => {
      return '查看' + institutionCount.value + '个机构'
    })
    onMounted(() => {
      // 获取合作机构列表
      getListData()
      // 获取所在区域
      getAreaInData()
      // 获取全部金融机构
      getBankAllData()
    })
    return {
      listData,
      loadMoreStatus,
      refresherTriggered,
      page,
      filterShow,
      areaList,
      bankAllList,
      showBank,
      scrolltolower,
      refresherrefresh,
      getMore,
      institutionLook,
      openFilter,
      isExpand,
      activeClass,
      handleChangeCheck,
      resetHandle,
      confirmHandle,
      getInstitutionCount
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
