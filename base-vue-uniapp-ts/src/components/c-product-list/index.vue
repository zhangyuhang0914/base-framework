<template lang="pug">
.page-view
  .finance-product-wrap
    .search-input
      up-search(v-model="searchValue" placeholder="请输入产品名称" @search="searchHandle" :show-action="false" shape="square" :animation="true" :clearabled="false")
      .search-btn(@click="searchHandle") {{ '搜索' }}
    .product-scroll-content
      .product-filter(@click="openFilter")
        span.txt {{ '筛选' }}
        u-icon(:name="filterShow ? 'arrow-up' : 'arrow-down'")
      scroll-view.scroll-view(
        scroll-y
        @scrolltolower="scrolltolower"
        @refresherrefresh='refresherrefresh'
        :refresher-enabled='true'
        :refresher-triggered='refresherTriggered'
      )
        .scroll-box(v-if="listData.length")
          //- # 后期优化-数据太多使用虚拟列表
          .scroll-item(v-for="(item, index) in listData" :key="index")
            .product-box(@click="productDetailClick(item)")
              .product-tips
                i.iconfont.icon-shigong
                .title {{ item.companySource }}
              .product-header
                img(:src="item.logoUrl" alt="")
                .title {{ item.name }}
              .product-content
                .product-data
                  .loan-limit-box.c-column
                    .value {{ item.loanLimit }}
                    .label {{ '贷款额度' }}
                  .rate-range-box.c-column
                    .value {{ item.rateRange }}
                    .label {{ '参考利率(年化)' }}
                  .loan-period-box.c-column
                    .value {{ item.loanPeriod }}
                    .label {{ '贷款期限' }}
                .product-info
                  .guarantee-mode-box.c-row
                    .label {{ '担保方式：' }}
                    .value(v-if="item.guaranteeMode + ''") {{ formatMode(item.guaranteeMode, guaranteeModeList, item.guaranteeModeExtra) }}
                  //- .product-source-box.c-row
                  //-   .label {{ item.productSource }}
              .product-footer
                .product-tag
                  .tag-box(v-for="(tagItem, index) in getTabName(item)" :key="index" :class="tagItem.class")
                    .tag-name {{ tagItem.tag }}
                .product-operation
                  .operation-box(@click.stop="collectionClick(item)")
                    i.iconfont(:class="item.isCollect ? 'icon-shouzanghou' : 'icon-shouzang'")
                  .operation-box(@click.stop="applyClick(item)")
                    i.iconfont.icon-shenqing
                  .operation-box(@click.stop='handleCompare(item)')
                    i.iconfont.icon-duibi
          u-loadmore(:status="loadMoreStatus" @loadmore="getMore")
        .no-data-view(v-else)
          CNoData
      up-popup.filter-popup(:show="filterShow" @close="filterShow = false" mode="bottom" :round="10")
        scroll-view.scroll-view(scroll-y)
          CustomTitle(title="贷款金额")
          .loan-limit-main.form-check
            .value-item(
              v-for="(item, index) in LOANLIMIT_LIST"
              :key="index"
              @click="handleChangeCheck(item.label, item.value, 'loanLimit')"
              :class="{ 'is-active': activeClass(item.label, item.value, 'loanLimit'), 'auto-width': item.label.length > 5 }"
            ) {{ item.label }}
          CustomTitle(title="贷款期限")
          .loan-period-main.form-check
            .value-item(
              v-for="(item, index) in LOANPERIOD_LIST"
              :key="index"
              @click="handleChangeCheck(item.label, item.value, 'loanPeriod')"
              :class="{ 'is-active': activeClass(item.label, item.value, 'loanPeriod'), 'auto-width': item.label.length > 5 }"
            ) {{ item.label }}
          CustomTitle(title="担保方式")
          .guarantee-type-main.form-check
            .value-item(
              v-for="(item, index) in guaranteeModeList"
              :key="index"
              @click="handleChangeCheck(item.name, item.value, 'guaranteeType')"
              :class="{ 'is-active': activeClass(item.name, item.value, 'guaranteeType'), 'auto-width': item.name.length > 5 }"
            ) {{ item.name }}
          CustomTitle(title="金融机构" v-if="!institutionsId")
            template(#right)
              .open(@click="isExpand")
                .show-txt {{ showBank ? '展开' : '收起' }}
                u-icon(v-if="showBank" name="arrow-down")
                u-icon(v-else name="arrow-up")
          .product-bank-main.form-check(v-if="!institutionsId" :class="{ 'is-hide': showBank }")
            .value-item(
              v-for="(item, index) in bankAllList"
              :key="index"
              @click="handleChangeCheck(item.bankName, item.id, 'productBank')"
              :class="{ 'is-active': activeClass(item.bankName, item.id, 'productBank'), 'auto-width': item.bankName.length > 5 }"
            ) {{ item.bankName }}
          CustomTitle(title="所在区域" v-if="!institutionsId")
          .area-main.form-check(v-if="!institutionsId")
            .value-item(
              v-for="(item, index) in areaList"
              :key="index"
              @click="handleChangeCheck(item.name, item.code, 'area')"
              :class="{ 'is-active': activeClass(item.name, item.code, 'area'), 'auto-width': item.name.length > 5 }"
            ) {{ item.name }}
          CustomTitle(title="产品类型" v-if="!institutionsId")
          .product-type-main.form-check(v-if="!institutionsId")
            .value-item(
              v-for="(item, index) in productTypeList"
              :key="index"
              @click="handleChangeCheck(item.name, item.value, 'productMainType')"
              :class="{ 'is-active': activeClass(item.name, item.value, 'productMainType'), 'auto-width': item.name.length > 5 }"
            ) {{ item.name }}
        .footer-opeation
          u-button.close-btn(type="info" shape="circle" @click="resetHandle") {{ '重 置' }}
          u-button.confirm-btn(type="primary" shape="circle" @click="confirmHandle") {{ '确 定' }}
      LoginValidateModal(ref='loginValidateRef' :type='loginValidateType')
      CProductContrast(ref="CProductContrastRef")
</template>

<script lang="ts">
import { defineComponent, ref, reactive, type Ref, onMounted, computed, watch } from 'vue'
import Layout from '@/components/layout/index.vue'
import CustomTitle from '@/components/custom-title/index.vue'
import CNoData from '@/components/c-no-data/index.vue'
import LoginValidateModal from '@/pages/user/loginValidateModal/index.vue'
import CProductContrast from '@/components/c-product-contrast/index.vue'
import type { PageItem, ProductQueryParams } from './type'
import { fileDownload } from '@/api/index'
import { areaInList, bankFindAll, collectionSave, productInfoList } from '@/api/financeProduct/index'
import { userCommonStoreHook } from '@/store/modules/common'
import { formatMode, joinArr } from '@/util/utils'
import type { DictListItem } from '@/api/index/types'
import type { AreaInListItem, BankListItem, CollectionParamsType, ProductListItem } from '@/api/financeProduct/types'
import type { ApiResponse } from '@/common/http/types'
import { linkJump } from '@/common/common'
import { setProductContrast, productApplyHandle, handleJudgeCollection } from '@/hooks/common'
import Bus, { REFRESH } from '@/common/bus'

export default defineComponent({
  name: 'FinanceProduct',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  },
  components: { Layout, CustomTitle, CNoData, LoginValidateModal, CProductContrast },
  props: {
    institutionsId: {
      type: String,
      default: ''
    }
  },
  setup(props, context) {
    const commonStoreHook = userCommonStoreHook()
    const listData = ref<ProductListItem[]>([])
    // LoadMore组件状态：loadmore查看更多 loading加载中 nomore没有更多
    const loadMoreStatus = ref<string>('loadmore')
    // 下拉刷新状态
    const refresherTriggered = ref<boolean>(false)
    const page = reactive<PageItem>({
      currentPage: 1,
      pageSize: 10,
      totalPage: 0
    })
    const filterShow = ref(false)
    const searchValue: Ref<string> = ref('')
    // 存储筛选条件
    const queryForm: Ref<ProductQueryParams> = ref({
      dkje: [], // 贷款金额
      dkqx: [], // 贷款期限
      guaranteeMode: [], // 担保方式
      bankId: [], // 金融机构
      cityCode: [], // 所在区域
      productMainType: [] // 产品类型
    })
    // 临时存储筛选条件
    const tempQueryForm: Ref<ProductQueryParams> = ref({
      dkje: [],
      dkqx: [],
      guaranteeMode: [],
      bankId: [],
      cityCode: [],
      productMainType: []
    })
    const LOANLIMIT_LIST = [
      { label: '100万以下', value: '0-100' },
      { label: '100-200万', value: '100-200' },
      { label: '200-500万', value: '200-500' },
      { label: '500-1000万', value: '500-1000' },
      { label: '1000-5000万', value: '1000-5000' },
      { label: '5000万以上', value: '5000-999999' }
    ] // 贷款金额
    const LOANPERIOD_LIST = [
      { label: '6个月及以下', value: '0-6' },
      { label: '6-12个月', value: '6-12' },
      { label: '12-24个月', value: '12-24' },
      { label: '24-36个月', value: '24-36' },
      { label: '36个月及以上', value: '36-999' }
    ] // 贷款期限
    const guaranteeModeList: Ref<DictListItem[]> = ref([]) // 担保方式
    const bankAllList: Ref<BankListItem[]> = ref([]) // 金融机构
    const areaList: Ref<AreaInListItem[]> = ref([]) // 所在区域
    const productTypeList: Ref<DictListItem[]> = ref([]) // 产品类型
    const showBank = ref(true)
    // 产品申请
    const { loginValidateRef, loginValidateType, jumpLoginFn, linkProductApply } = productApplyHandle()
    // 产品对比
    const CProductContrastRef = ref()
    const searchHandle = () => {
      getListData(true)
    }
    // 获取担保方式
    const getGuaranteeMode = async () => {
      const result: DictListItem[] = await commonStoreHook.getDict('guarantee_type')
      guaranteeModeList.value = result
    }
    // 获取金融机构
    const getBankAllData = () => {
      bankFindAll({}).then((result: ApiResponse<BankListItem[]>) => {
        bankAllList.value = result.data
      })
    }
    // 获取所在区域
    const getAreaInData = () => {
      areaInList({}).then((result: ApiResponse<AreaInListItem[]>) => {
        areaList.value = result.data
      })
    }
    // 获取产品类型
    const getProductType = async () => {
      const result: DictListItem[] = await commonStoreHook.getDict('product_main_type')
      productTypeList.value = result
    }
    // 滚动到底部刷新
    const scrolltolower = () => {
      if (loadMoreStatus.value === 'loadmore') {
        // 若此时可以加载更多才触发，避免频繁触底发起请求
        getMore()
      }
    }
    // 下拉刷新
    const refresherrefresh = () => {
      console.log('下拉刷新', refresherTriggered.value)
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
    // 获取产品列表
    const getListData = (reset = false) => {
      // 重置页码
      if (reset) {
        page.currentPage = 1
        listData.value = []
      }
      let params = {
        isApplets: '1',
        page: page.currentPage,
        limit: page.pageSize,
        dkje: joinArr(queryForm.value.dkje), // 贷款金额
        dkqx: joinArr(queryForm.value.dkqx), // 贷款期限
        guaranteeMode: joinArr(queryForm.value.guaranteeMode), // 担保方式
        bank_id: joinArr(queryForm.value.bankId), // 金融机构
        city_code: joinArr(queryForm.value.cityCode), // 所在区域
        name: searchValue.value, // 产品名称
        productMainType: joinArr(queryForm.value.productMainType), // 产品类型
        fin_institutions_info_id: props.institutionsId, // 产品机构id
        sidx: 'pubdate',
        order: 'desc'
      }
      loadMoreStatus.value = 'loading'
      productInfoList(params)
        .then((result: ApiResponse<ProductListItem[]>) => {
          let data = result.page
          data.list.map((item: ProductListItem) => {
            item['logoUrl'] = item.logoFileId && fileDownload(item.logoFileId)
            item['companySource'] = '本产品由' + item.institutionsName + '提供'
            item['loanPeriod'] = item.loanPeriodBegin === 0 ? item.loanPeriodEnd + '个月及以下' : item.loanPeriodBegin + '-' + item.loanPeriodEnd + '个月'
            item['rateRange'] = item.rateRangeBegin + '%-' + item.rateRangeEnd + '%'
            item['loanLimit'] = item.loanLimitBegin + '~' + item.loanLimitEnd + '万元'
            item['productSource'] = '产品来源：' + item.institutionsName
            item['isCollect'] = item.whetherCollection + '' === '0' ? true : false
            // item['characteristics'] = '高富帅帅,白富美帅,富富富帅'
          })
          if (data.currPage === 1 && data.totalCount === 0 && data.totalPage === 0) {
            // 暂无数据
            listData.value = []
          } else {
            listData.value = listData.value.concat(data.list || [])
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
    const getTabName = (item: ProductListItem) => {
      if (!item.characteristics) return false
      return item.characteristics.split(',').map((childItem: string, itemIndex: number) => {
        return { tag: childItem, class: `tag${itemIndex + 1}` }
      })
    }
    // 产品收藏
    const collectionClick = async (item: ProductListItem) => {
      if (!item.id) return
      if (!jumpLoginFn()) return
      handleJudgeCollection('1', item, (isCollect: boolean) => {
        item.isCollect = isCollect
      })
    }
    // 产品申请
    const applyClick = async (item: ProductListItem) => {
      if (!item.id) return
      linkProductApply(item)
    }
    // 产品对比
    const handleCompare = (item: ProductListItem) => {
      setProductContrast(item, 'push')
      CProductContrastRef.value && CProductContrastRef.value.init()
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
      if (type === 'loanLimit') {
        if (tempQueryForm.value.dkje && tempQueryForm.value.dkje.indexOf(id) > -1) {
          return true
        }
      } else if (type === 'loanPeriod') {
        if (tempQueryForm.value.dkqx && tempQueryForm.value.dkqx.indexOf(id) > -1) {
          return true
        }
      } else if (type === 'guaranteeType') {
        if (tempQueryForm.value.guaranteeMode && tempQueryForm.value.guaranteeMode.indexOf(id) > -1) {
          return true
        }
      } else if (type === 'productBank') {
        if (tempQueryForm.value.bankId && tempQueryForm.value.bankId.indexOf(id) > -1) {
          return true
        }
      } else if (type === 'area') {
        if (tempQueryForm.value.cityCode && tempQueryForm.value.cityCode.indexOf(id) > -1) {
          return true
        }
      } else if (type === 'productMainType') {
        if (tempQueryForm.value.productMainType && tempQueryForm.value.productMainType.indexOf(id) > -1) {
          return true
        }
      }
    })
    // 列表筛选选中
    const handleChangeCheck = (name: string, id: string, type: string) => {
      if (type === 'loanLimit') {
        if (tempQueryForm.value.dkje.indexOf(id) > -1) {
          let index = tempQueryForm.value.dkje.indexOf(id)
          tempQueryForm.value.dkje.splice(index, 1)
        } else {
          tempQueryForm.value.dkje.push(id)
        }
      } else if (type === 'loanPeriod') {
        if (tempQueryForm.value.dkqx.indexOf(id) > -1) {
          let index = tempQueryForm.value.dkqx.indexOf(id)
          tempQueryForm.value.dkqx.splice(index, 1)
        } else {
          tempQueryForm.value.dkqx.push(id)
        }
      } else if (type === 'guaranteeType') {
        if (tempQueryForm.value.guaranteeMode.indexOf(id) > -1) {
          let index = tempQueryForm.value.guaranteeMode.indexOf(id)
          tempQueryForm.value.guaranteeMode.splice(index, 1)
        } else {
          tempQueryForm.value.guaranteeMode.push(id)
        }
      } else if (type === 'productBank') {
        if (tempQueryForm.value.bankId.indexOf(id) > -1) {
          let index = tempQueryForm.value.bankId.indexOf(id)
          tempQueryForm.value.bankId.splice(index, 1)
        } else {
          tempQueryForm.value.bankId.push(id)
        }
      } else if (type === 'area') {
        if (tempQueryForm.value.cityCode.indexOf(id) > -1) {
          let index = tempQueryForm.value.cityCode.indexOf(id)
          tempQueryForm.value.cityCode.splice(index, 1)
        } else {
          tempQueryForm.value.cityCode.push(id)
        }
      } else if (type === 'productMainType') {
        if (tempQueryForm.value.productMainType.indexOf(id) > -1) {
          let index = tempQueryForm.value.productMainType.indexOf(id)
          tempQueryForm.value.productMainType.splice(index, 1)
        } else {
          tempQueryForm.value.productMainType.push(id)
        }
      }
    }
    // 重置
    const resetHandle = () => {
      tempQueryForm.value.dkje = []
      tempQueryForm.value.dkqx = []
      tempQueryForm.value.guaranteeMode = []
      tempQueryForm.value.bankId = []
      tempQueryForm.value.cityCode = []
      tempQueryForm.value.productMainType = []
      queryForm.value = JSON.parse(JSON.stringify(tempQueryForm.value))
      getListData(true)
      filterShow.value = false
    }
    // 确定
    const confirmHandle = () => {
      queryForm.value = JSON.parse(JSON.stringify(tempQueryForm.value))
      getListData(true)
      filterShow.value = false
    }
    const productDetailClick = (item: ProductListItem) => {
      linkJump(`/pagesFinanceProduct/productDetail/index?id=${item.id}`)
    }
    watch(
      () => filterShow.value,
      value => {
        if (!value && JSON.stringify(tempQueryForm.value) !== JSON.stringify(queryForm.value)) {
          tempQueryForm.value = JSON.parse(JSON.stringify(queryForm.value))
        }
      }
    )
    onMounted(() => {
      // 获取产品列表
      getListData()
      // 获取担保方式
      getGuaranteeMode()
      // 获取全部金融机构
      getBankAllData()
      // 获取所在区域
      getAreaInData()
      // 获取产品类型
      getProductType()
      // 刷新
      Bus.$on(REFRESH, (flag: boolean) => {
        // 获取产品列表
        getListData(true)
      })
    })
    return {
      listData,
      loadMoreStatus,
      refresherTriggered,
      formatMode,
      filterShow,
      searchValue,
      queryForm,
      LOANLIMIT_LIST,
      LOANPERIOD_LIST,
      guaranteeModeList,
      bankAllList,
      areaList,
      productTypeList,
      showBank,
      loginValidateRef,
      loginValidateType,
      CProductContrastRef,
      searchHandle,
      scrolltolower,
      refresherrefresh,
      getMore,
      getTabName,
      collectionClick,
      applyClick,
      handleCompare,
      openFilter,
      isExpand,
      activeClass,
      handleChangeCheck,
      resetHandle,
      confirmHandle,
      productDetailClick
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
