import { ref } from 'vue'
import { getBase64AreaCode } from '@/api/helper/common'
import type { AreaItem, Base64AreaCodeParams, MatterItem } from '@/api/interface/common'
import type { RegionItem } from '@/hooks/interface/useRegionSelect'

export function useRegionSelect() {
  // 动作面板显示
  const actionSheetShow = ref(false)
  // 步骤条区域数据
  const stepsArea = ref<AreaItem[]>([
    {
      children: [],
      code: '420000000000',
      grade: '2',
      name: '湖北省',
      parentCode: '',
      shortCode: '420000',
      show: '1'
    }
  ])
  // 步骤条激活id
  const stepActiveId = ref(0)
  // 步骤条选中id
  const selectIndex = ref(0)
  // 默认湖北省区划代码
  const defaultRegionCode = '420000000000'
  // 省级区划
  const areaList = ref<AreaItem[]>([])
  // 省市级下面事项列表
  const itemList = ref<MatterItem[]>([])
  // 当前选中事项item
  const currentItem = ref<RegionItem | {}>()
  // 事务项目
  const transactItem = ref<AreaItem | {}>()
  // 初始化数据
  const initData = async (
    regionCode: string,
    currentItemData?: RegionItem,
    transactItemData?: AreaItem
  ) => {
    const params: Base64AreaCodeParams = {
      transactNameBase64: currentItemData?.ITEM_CODE || '',
      regionCode: regionCode,
      source: '1',
      isOnline: ''
    }
    window.ehbAppJssdk.notice.showPreloader({
      text: '使劲加载中..'
    })
    try {
      // const result = {
      //   algorithm: 0,
      //   code: 1,
      //   encrypt: false,
      //   msg: '操作成功',
      //   ok: true,
      //   rsa: false,
      //   status: 200,
      //   data: {
      //     areaList: [
      //       {
      //         children: null,
      //         code: '420100000000',
      //         grade: '3',
      //         name: '武汉市',
      //         parentCode: '420000000000',
      //         shortCode: '420100',
      //         show: '2'
      //       },
      //       {
      //         children: null,
      //         code: '420600000000',
      //         grade: '3',
      //         name: '襄阳市',
      //         parentCode: '420000000000',
      //         shortCode: '420600',
      //         show: '1'
      //       },
      //       {
      //         children: null,
      //         code: '420500000000',
      //         grade: '3',
      //         name: '宜昌市',
      //         parentCode: '420000000000',
      //         shortCode: '420500',
      //         show: '1'
      //       },
      //       {
      //         children: null,
      //         code: '420200000000',
      //         grade: '3',
      //         name: '黄石市',
      //         parentCode: '420000000000',
      //         shortCode: '420200',
      //         show: '1'
      //       },
      //       {
      //         children: null,
      //         code: '420300000000',
      //         grade: '3',
      //         name: '十堰市',
      //         parentCode: '420000000000',
      //         shortCode: '420300',
      //         show: '1'
      //       },
      //       {
      //         children: null,
      //         code: '421000000000',
      //         grade: '3',
      //         name: '荆州市',
      //         parentCode: '420000000000',
      //         shortCode: '421000',
      //         show: '1'
      //       },
      //       {
      //         children: null,
      //         code: '420800000000',
      //         grade: '3',
      //         name: '荆门市',
      //         parentCode: '420000000000',
      //         shortCode: '420800',
      //         show: '1'
      //       },
      //       {
      //         children: null,
      //         code: '420700000000',
      //         grade: '3',
      //         name: '鄂州市',
      //         parentCode: '420000000000',
      //         shortCode: '420700',
      //         show: '1'
      //       },
      //       {
      //         children: null,
      //         code: '420900000000',
      //         grade: '3',
      //         name: '孝感市',
      //         parentCode: '420000000000',
      //         shortCode: '420900',
      //         show: '1'
      //       },
      //       {
      //         children: null,
      //         code: '421100000000',
      //         grade: '3',
      //         name: '黄冈市',
      //         parentCode: '420000000000',
      //         shortCode: '421100',
      //         show: '1'
      //       },
      //       {
      //         children: null,
      //         code: '421200000000',
      //         grade: '3',
      //         name: '咸宁市',
      //         parentCode: '420000000000',
      //         shortCode: '421200',
      //         show: '1'
      //       },
      //       {
      //         children: null,
      //         code: '421300000000',
      //         grade: '3',
      //         name: '随州市',
      //         parentCode: '420000000000',
      //         shortCode: '421300',
      //         show: '1'
      //       },
      //       {
      //         children: null,
      //         code: '422800000000',
      //         grade: '3',
      //         name: '恩施州',
      //         parentCode: '420000000000',
      //         shortCode: '422800',
      //         show: '1'
      //       },
      //       {
      //         children: null,
      //         code: '429004000000',
      //         grade: '3',
      //         name: '仙桃市',
      //         parentCode: '420000000000',
      //         shortCode: '429004',
      //         show: '1'
      //       },
      //       {
      //         children: null,
      //         code: '429006000000',
      //         grade: '3',
      //         name: '天门市',
      //         parentCode: '420000000000',
      //         shortCode: '429006',
      //         show: '1'
      //       },
      //       {
      //         children: null,
      //         code: '429005000000',
      //         grade: '3',
      //         name: '潜江市',
      //         parentCode: '420000000000',
      //         shortCode: '429005',
      //         show: '1'
      //       },
      //       {
      //         children: null,
      //         code: '429021000000',
      //         grade: '3',
      //         name: '神农架林区',
      //         parentCode: '420000000000',
      //         shortCode: '429021',
      //         show: '1'
      //       }
      //     ],
      //     itemList: [
      //       {
      //         btnName: '在线办理',
      //         expressType: null,
      //         formType: '3',
      //         grade: '2,3,4',
      //         handlingTimes: '1',
      //         highlightName: null,
      //         highlightTaskName: null,
      //         highlightTransactName: null,
      //         id: '11420000010833209R200201400300107',
      //         isAppOnline: '1',
      //         isExpress: '0',
      //         isFee: '0',
      //         isMobileTerminal: '0',
      //         isOnline: '1',
      //         isOnlineLc: '1',
      //         isPayOnline: '0',
      //         isSchedule: '0',
      //         isServiceTerminals: '0',
      //         itemClass: '2',
      //         itemOrder: 1,
      //         label: null,
      //         orgCode: '11420000010833209R',
      //         orgName: '湖北省人力资源和社会保障厅',
      //         parentCodeToCity: null,
      //         parentCodeToCounty: null,
      //         parentCodeToProvince: '420000000000',
      //         parentCodeToTown: null,
      //         parentCodeToVillage: null,
      //         projectCreateTime: '2025-06-09 17:52:17.0',
      //         promiseDay: '5',
      //         regionCode: '420000000000',
      //         regionGrade: '2',
      //         regionName: '湖北省',
      //         serviceFr: '0',
      //         serviceGr: '1',
      //         shortOrgName: '省人社厅',
      //         sortOrder: '0',
      //         subjectIdsFr: '035',
      //         subjectIdsGr: '085',
      //         syncTime: '20251014112002',
      //         taskCode: '11420000010833209R2002014003001',
      //         taskName: '缴费人员增减申报',
      //         taskNameTransactName: '缴费人员增减申报-【省集中企保系统】灵活就业养老保险暂停',
      //         taskType: '20',
      //         transBuSiCount: 148,
      //         transactCode: '11420000010833209R200201400300107',
      //         transactCode14: '00201400300107',
      //         transactId: '808455468505628672',
      //         transactName: '【省集中企保系统】灵活就业养老保险暂停',
      //         transactNameBase64: 'F9DE4A9799E9F26FB210FD3D43D65E84',
      //         transactNum: null,
      //         transactOrder: '07',
      //         transactionCreateTime: '20251014112002'
      //       }
      //     ]
      //   }
      // }
      const result = await getBase64AreaCode(params)
      if (+result.code === 1) {
        const data = result.data || {}
        if (
          transactItemData &&
          transactItemData.grade === '5' &&
          selectIndex.value === stepsArea.value.length - 1
        ) {
          areaList.value = []
        } else {
          const isAllShow = data.areaList.every((area: AreaItem) => area.show === '0')
          areaList.value = !isAllShow ? [...data.areaList] : []
        }
        itemList.value = [...data.itemList]
        console.log('获取区划编码', result, areaList.value, itemList.value)
      }
    } catch (err) {
      console.log('err', err)
    } finally {
      window.ehbAppJssdk.notice.hidePreloader()
    }
  }
  // 点击区划
  const handleClickCity = (item: AreaItem, index: number) => {
    if (item.show === '0') return false
    transactItem.value = item
    // 判断区划没有重复
    if (
      stepsArea.value.every(area => area.grade !== item.grade && area.code !== item.code) &&
      item.grade !== '5'
    ) {
      initData(item.code, currentItem.value, item as AreaItem)
      stepsArea.value.push(item)
      selectIndex.value = stepsArea.value.length - 1
      stepActiveId.value = stepsArea.value.length - 1
    } else if (
      // 判断是相同区划
      stepsArea.value.some(area => area.grade === item.grade && area.code === item.code) &&
      item.grade !== '5'
    ) {
      initData(item.code, currentItem.value, item as AreaItem)
      selectIndex.value = stepActiveId.value
    } else if (stepsArea.value.some(area => area.grade === item.grade && area.code !== item.code)) {
      // 判断区划等级相同，区划不同
      stepsArea.value = stepsArea.value.slice(0, selectIndex.value + 1)
      const targetArea = areaList.value.find(area => area.code === item.code)
      if (targetArea) {
        stepsArea.value.push(targetArea)
      }
      initData(
        stepsArea.value[stepsArea.value.length - 1].code,
        currentItem.value,
        item as AreaItem
      )
      selectIndex.value = stepsArea.value.length - 1
      stepActiveId.value = stepsArea.value.length - 1
    } else if (item.grade === '5') {
      // 等级为5的情况
      stepsArea.value.push(item)
      selectIndex.value = stepsArea.value.length - 1
      stepActiveId.value = stepsArea.value.length - 1
      initData(
        stepsArea.value[stepsArea.value.length - 1].code,
        currentItem.value,
        item as AreaItem
      )
    }
  }
  // 选中已选区划
  const handleClickSteps = (index: number) => {
    if (selectIndex.value === index) return false
    selectIndex.value = index
    initData(stepsArea.value[index].code, currentItem.value, transactItem.value as AreaItem)
  }
  // 选择区划确定
  const confirm = () => {
    const params: any = {}
    if (itemList.value.length === 1) {
      params.transactCode = itemList.value[0].transactCode
      ehbAppJssdk.operateWindow.openMatter(params)
      actionSheetShow.value = false
    }
  }
  // 打开动作面板
  const openActiveSheet = async (currentItemData: RegionItem) => {
    selectIndex.value = 0
    stepActiveId.value = 0
    stepsArea.value = [
      {
        children: [],
        code: '420000000000',
        grade: '2',
        name: '湖北省',
        parentCode: '',
        shortCode: '420000',
        show: '1'
      }
    ]
    areaList.value = []
    itemList.value = []
    transactItem.value = {}
    currentItem.value = currentItemData
    await initData(defaultRegionCode, currentItemData)
    actionSheetShow.value = true
  }

  return {
    actionSheetShow,
    stepsArea,
    stepActiveId,
    selectIndex,
    areaList,
    itemList,
    handleClickCity,
    handleClickSteps,
    confirm,
    openActiveSheet
  }
}
