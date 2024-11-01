<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" headerTitle="产品对比")
    template(#main)
      .roduct-contrast-wrap
        scroll-view.scroll-view(scroll-y)
          .scroll-box
            .table
              .tr(v-for="(item, index) in contrastData" :key="index")
                .td
                  .equal-label(v-if="item.key === 'name'")
                    up-switch(v-model="hideEqual" size="20" @change="handleChangeSwitch")
                    .text {{ item.value1 }}
                  .values(v-else) {{ item.value1 }}
                .td
                  .values {{ item.value2 }}
                  .operation-box(v-if="item.key === 'name'")
                    .operation(@click="replaceProduct(item.value2)")
                      i.iconfont.icon-huangechanpin
                      .text {{ '换个产品' }}
                    .operation(@click="handleApplyNow(item.value2)")
                      i.iconfont.icon-woyaoshenqing
                      .text {{ '我要申请' }}
                .td(:class="{ 'select-product-main': item.key === 'name' && !item.value3 }")
                  .values(v-if="item.value3 !== undefined") {{ item.value3 }}
                  .operation-box(v-if="item.key === 'name' && item.value3")
                    .operation(@click="replaceProduct(item.value3)")
                      i.iconfont.icon-huangechanpin
                      .text {{ '换个产品' }}
                    .operation(@click="handleApplyNow(item.value3)")
                      i.iconfont.icon-woyaoshenqing
                      .text {{ '我要申请' }}
                  .operation-box(v-if="item.key === 'name' && !item.value3")
                    .operation(@click="addProduct")
                      u-icon(name="plus" color="#4C5F99" size="15" bold)
                      .text {{ '选择产品' }}
        LoginValidateModal(ref='loginValidateRef' :type='loginValidateType')
        up-popup.filter-popup(:show="filterShow" @close="filterShow = false" mode="bottom" :round="10")
          scroll-view.popup-scroll-view(
            scroll-y
            :refresher-enabled='true'
            :refresher-triggered='refresherTriggered'
            @scrolltolower="scrolltolower"
            @refresherrefresh='refresherrefresh'
          )
            .search-input
              up-search(v-model="searchValue" placeholder="请输入产品名称" @search="searchHandle" :show-action="false" shape="square" :animation="true" :clearabled="false")
              .search-btn(@click="searchHandle") {{ '搜索' }}
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
            .popup-scroll-box(v-if="listData.length")
              //- # 后期优化-数据太多使用虚拟列表
              .popup-scroll-item(v-for="(item, index) in listData" :key="index" :class="{ 'active-item': activeId === item.id }")
                .active-checkbox(v-if="activeId === item.id")
                  u-icon.active-icon(name="checkbox-mark")
                .product-box(@click="handleChangeProduct(item)")
                  .product-header
                    .img-logo
                      image(:src="item.logoUrl" mode="widthFix" :lazy-load="true" alt="")
                    .product-title
                      .name.text-line2-overflow {{ item.name }}
                      .source {{ item.companySource }}
                  .product-content
                    .product-data
                      .rate-range-box.c-column
                        .value {{ item.rateRange }}
                        .label {{ '参考利率' }}
                      .loan-limit-box.c-column
                        .value {{ item.loanLimit }}
                        .label {{ '贷款额度' }}
                      .loan-period-box.c-column
                        .value {{ item.loanPeriod }}
                        .label {{ '贷款期限' }}
                  .product-footer
                    .guarantee-mode-left
                      .mode-value(v-if="item.guaranteeMode + ''") {{ '担保方式：' + formatMode(item.guaranteeMode, guaranteeModeList, item.guaranteeModeExtra) }}
              u-loadmore(:status="loadMoreStatus" @loadmore="getMore")
            .no-data-view(v-else)
              CNoData
          .footer-opeation
            u-button.reset-btn(type="info" shape="circle" @click="resetHandle") {{ '重 置' }}
            u-button.confirm-btn(type="primary" shape="circle" :disabled="!activeId" @click="confirmHandle") {{ '确 定' }}
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, type Ref } from 'vue'
import Layout from '@/components/layout/index.vue'
import CustomTitle from '@/components/custom-title/index.vue'
import CNoData from '@/components/c-no-data/index.vue'
import LoginValidateModal from '@/pages/user/loginValidateModal/index.vue'
import { userCommonStoreHook } from '@/store/modules/common'
import { formatMode, joinArr } from '@/util/utils'
import type { DictListItem } from '@/api/index/types'
import type { ProductListItem } from '@/api/financeProduct/types'
import { setProductContrast, productApplyHandle } from '@/hooks/common'
import type { PageItem } from '@/api/index/types'
import { productInfoList } from '@/api/financeProduct'
import type { ApiResponse } from '@/common/http/types'
import { fileDownload } from '@/api/index'

export default defineComponent({
  name: 'ProductContrast',
  components: { Layout, CustomTitle, CNoData, LoginValidateModal },
  setup(props) {
    const commonHook = userCommonStoreHook()
    const hideEqual: Ref<boolean> = ref(false)
    const labelsData: AnyObject = reactive({
      name: '隐藏相同项',
      institutionsName: '发行机构',
      rateRange: '参考利率',
      loanLimit: '贷款额度',
      guaranteeMode: '担保方式',
      loanPeriod: '贷款期限',
      productDesc: '产品介绍',
      characteristics: '产品特点',
      customerDesc: '适用客户',
      useDesc: '贷款用途'
    })
    const type: Ref<string> = ref('replace')
    const contrastData: AnyObject = ref([]) // 对比数据
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
    // 产品申请
    const { loginValidateRef, loginValidateType, linkProductApply } = productApplyHandle()
    // 换个产品
    const filterShow = ref(false)
    const replaceProductId = ref<string>('') // 需要替换的产品id
    const activeId = ref<string>('')
    const activeProductItem = ref<ProductListItem | {}>({})
    const listData = ref<ProductListItem[]>([]) // 产品列表
    // LoadMore组件状态：loadmore查看更多 loading加载中 nomore没有更多
    const loadMoreStatus = ref<string>('loadmore')
    // 下拉刷新状态
    const refresherTriggered = ref<boolean>(false)
    const page = reactive<PageItem>({
      currentPage: 1,
      pageSize: 10,
      totalPage: 0
    })
    const searchValue: Ref<string> = ref('')
    const queryForm: Ref<AnyObject> = ref({
      dkje: [], // 贷款金额
      dkqx: [], // 贷款期限
      guaranteeMode: [] // 担保方式
    })
    // 获取担保方式
    const getGuaranteeMode = async () => {
      const result: DictListItem[] = await commonHook.getDict('guarantee_type')
      guaranteeModeList.value = result
    }
    // 隐藏相同项
    const handleChangeSwitch = (event: AnyObject) => {
      if (hideEqual.value) {
        const filteredArray = _getProductContrastList().filter(item => item.value2 !== item.value3)
        contrastData.value = filteredArray
      } else {
        // 使用原始的 _getProductContrastList() 数组
        contrastData.value = _getProductContrastList()
      }
    }
    // 格式化数据
    const formatterData = (dataList: AnyObject) => {
      const formattedDataArray = []
      // 遍历 labelsData 对象中的每个键值对
      for (const key in labelsData) {
        if (labelsData.hasOwnProperty(key)) {
          const formattedObj: AnyObject = {
            key: key,
            value1: labelsData[key]
          }
          // 检查 dataArray 数组中的对象是否存在与 labelsData 对象中的键相同的属性
          for (let i = 0; i < dataList.length; i++) {
            if (dataList[i].hasOwnProperty(key)) {
              // 处理担保方式
              if (key === 'guaranteeMode') {
                formattedObj[`value${i + 2}`] = formatMode(dataList[i][key], guaranteeModeList.value, dataList[i]['guaranteeModeExtra'])
              } else {
                formattedObj[`value${i + 2}`] = dataList[i][key]
              }
            }
          }
          formattedDataArray.push(formattedObj)
        }
      }
      return formattedDataArray
    }
    // 换个产品
    const replaceProduct = (name: string) => {
      let productItem = commonHook.productContrastList.filter((productItem: ProductListItem) => productItem.name === name)[0]
      replaceProductId.value = productItem.id
      type.value = 'replace'
      filterShow.value = true
      // 获取产品列表
      getListData(true)
    }
    // 我要申请
    const handleApplyNow = (name: string) => {
      let productItem = commonHook.productContrastList.filter((productItem: ProductListItem) => productItem.name === name)[0]
      if (!productItem.id) return
      linkProductApply(productItem)
    }
    // 添加产品
    const addProduct = () => {
      type.value = 'push'
      filterShow.value = true
      // 获取产品列表
      getListData(true)
    }
    // 搜索
    const searchHandle = () => {
      getListData(true)
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
        dockingFlag: '0', // 过滤市州产品
        isApplets: '1',
        page: page.currentPage,
        limit: page.pageSize,
        dkje: joinArr(queryForm.value.dkje), // 贷款金额
        dkqx: joinArr(queryForm.value.dkqx), // 贷款期限
        guaranteeMode: joinArr(queryForm.value.guaranteeMode), // 担保方式
        bank_id: '', // 金融机构
        city_code: '', // 所在区域
        name: searchValue.value, // 产品名称
        productMainType: '', // 产品类型
        fin_institutions_info_id: '', // 产品机构id
        sidx: 'pubdate',
        order: 'desc'
      }
      loadMoreStatus.value = 'loading'
      productInfoList(params)
        .then((result: ApiResponse<ProductListItem[]>) => {
          let data = result.page
          data.list.map((item: ProductListItem) => {
            item['logoUrl'] = item.logoFileId && fileDownload(item.logoFileId)
            item['companySource'] = item.institutionsName + '提供'
            item['loanPeriod'] = item.loanPeriodBegin === 0 ? item.loanPeriodEnd + '个月及以下' : item.loanPeriodBegin + '-' + item.loanPeriodEnd + '个月'
            item['rateRange'] = item.rateRangeBegin + '%-' + item.rateRangeEnd + '%'
            item['loanLimit'] = item.loanLimitBegin + '~' + item.loanLimitEnd + '万元'
            item['productSource'] = '产品来源：' + item.institutionsName
            item['isCollect'] = item.whetherCollection + '' === '0' ? true : false
            // item['characteristics'] = '高富帅,白富美,富富富'
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
    // 列表筛选选中激活
    const activeClass = computed(() => (name: string, id: string, type: string) => {
      if (type === 'loanLimit') {
        if (queryForm.value.dkje && queryForm.value.dkje.indexOf(id) > -1) {
          return true
        }
      } else if (type === 'loanPeriod') {
        if (queryForm.value.dkqx && queryForm.value.dkqx.indexOf(id) > -1) {
          return true
        }
      } else if (type === 'guaranteeType') {
        if (queryForm.value.guaranteeMode && queryForm.value.guaranteeMode.indexOf(id) > -1) {
          return true
        }
      }
    })
    // 列表筛选选中
    const handleChangeCheck = (name: string, id: string, type: string) => {
      if (type === 'loanLimit') {
        if (queryForm.value.dkje.indexOf(id) > -1) {
          let index = queryForm.value.dkje.indexOf(id)
          queryForm.value.dkje.splice(index, 1)
        } else {
          queryForm.value.dkje.push(id)
        }
      } else if (type === 'loanPeriod') {
        if (queryForm.value.dkqx.indexOf(id) > -1) {
          let index = queryForm.value.dkqx.indexOf(id)
          queryForm.value.dkqx.splice(index, 1)
        } else {
          queryForm.value.dkqx.push(id)
        }
      } else if (type === 'guaranteeType') {
        if (queryForm.value.guaranteeMode.indexOf(id) > -1) {
          let index = queryForm.value.guaranteeMode.indexOf(id)
          queryForm.value.guaranteeMode.splice(index, 1)
        } else {
          queryForm.value.guaranteeMode.push(id)
        }
      }
      getListData(true)
    }
    // 产品选中
    const handleChangeProduct = (item: ProductListItem) => {
      if (activeId.value === item.id) {
        activeId.value = ''
        activeProductItem.value = {}
      } else {
        activeId.value = item.id
        activeProductItem.value = item
      }
    }
    // 重置
    const resetHandle = () => {
      searchValue.value = ''
      queryForm.value.dkje = []
      queryForm.value.dkqx = []
      queryForm.value.guaranteeMode = []
      activeId.value = ''
      activeProductItem.value = {}
      replaceProductId.value = ''
      getListData(true)
      filterShow.value = false
    }
    const confirmHandle = () => {
      setProductContrast(activeProductItem.value as ProductListItem, type.value, replaceProductId.value)
      // 更新数据
      contrastData.value = _getProductContrastList()
      filterShow.value = false
    }
    // 格式化产品对比数据
    const _getProductContrastList = () => {
      return formatterData(commonHook.productContrastList)
    }
    onMounted(async () => {
      // 获取担保方式
      await getGuaranteeMode()
      contrastData.value = _getProductContrastList()
    })
    return {
      formatMode,
      hideEqual,
      labelsData,
      contrastData,
      LOANLIMIT_LIST,
      LOANPERIOD_LIST,
      guaranteeModeList,
      loginValidateRef,
      loginValidateType,
      filterShow,
      activeId,
      listData,
      loadMoreStatus,
      refresherTriggered,
      searchValue,
      handleChangeSwitch,
      replaceProduct,
      handleApplyNow,
      addProduct,
      searchHandle,
      scrolltolower,
      refresherrefresh,
      getMore,
      getTabName,
      activeClass,
      handleChangeCheck,
      handleChangeProduct,
      resetHandle,
      confirmHandle,
      _getProductContrastList
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
