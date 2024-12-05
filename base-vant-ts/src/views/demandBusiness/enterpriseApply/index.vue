<template lang="pug">
.page-wrap
  TabsBar(v-model="tabActive" :tabData="tabsData")
  .content-wrap
    vanForm(
      ref="formRef"
      label-width="140px"
      input-align="right"
      required="auto"
      show-error
      :show-error-message="false"
      @submit="onSubmit"
    )
      //- 基本信息
      template(v-if="step === 1")
        vanField(v-model="form.baseInfo.enterpriseName" name="企业名称" label="企业名称" placeholder="请输入企业名称" :rules="[{ required: true, message: '请输入企业名称' }]")
        vanField(v-model="form.baseInfo.uscc" name="统一社会信用代码" label="统一社会信用代码" placeholder="请输入统一社会信用代码" :rules="[{ required: true, message: '请输入统一社会信用代码' }]")
        vanField(:value="form.baseInfo.industryTypeName" name="行业类型" label="行业类型" placeholder="请选择行业类型" clickable readonly :rules="[{ required: true, message: '请选择行业类型' }]" @click="industryTypePicker = true")
          template(#button)
            vanIcon(name="arrow")
        vanField(:value="form.baseInfo.businessTypeName" name="经营主体类型" label="经营主体类型" placeholder="请选择经营主体类型" clickable readonly :rules="[{ required: true, message: '请选择经营主体类型' }]" @click="businessTypePicker = true")
          template(#button)
            vanIcon(name="arrow")
        vanField( v-if="form.baseInfo.businessType === 'qt'" v-model="form.baseInfo.businessRemark" name="经营主体类型备注" label="经营主体类型备注" placeholder="请输入经营主体类型备注" :rules="[{ required: true, message: '请输入经营主体类型备注' }]")
        vanField(v-model="form.baseInfo.contactPerson" name="联系人" label="联系人" placeholder="请输入联系人" :rules="[{ required: true, message: '请输入联系人' }]")
        vanField(v-model="form.baseInfo.contactPhone" name="联系电话" label="联系电话" placeholder="请输入联系电话" type="tel" :rules="[{ required: true, message: '请输入联系电话' }, { validator: validateMobile }]")
        vanField(style="display: none;")
      //- 经营场所
      template(v-if="step === 2")
      //- 贷款需求
      template(v-if="step === 3")
      //- 提交按钮
      .operation-btn
        vanButton.custom-info-btn(v-if="step !== 1" block native-type="button" @click="handlePrev") {{ '上一步' }}
        vanButton(v-if="step !== 3" block type="primary" native-type="button" @click="handleNext") {{ '下一步' }}
        vanButton(v-if="step === 3" block type="primary" native-type="submit") {{ '提交申请' }}
  //- 行业类型选择器
  PopupPicker(v-model="industryTypePicker" :columns="industryTypeList")
  //- 经营主体类型选择器
  PopupPicker(v-model="businessTypePicker" :columns="businessTypeList")
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import TabsBar from '@/views/demandBusiness/components/tabsBar/index.vue'
import PopupPicker from '@/views/demandBusiness/components/popupPicker/index.vue'
import type { TabsItem, TabsItemType } from '../components/type'
import type { FormInstance } from 'vant'
import type { DictListItem } from '@/api/model'
import { userCommonStoreHook } from '@/stores/modules/common'
import { listToTree } from '@/utils/utils'
import { validateMobile } from '@/utils/validator'

export default defineComponent({
  name: 'EnterpriseApply',
  components: { TabsBar, PopupPicker },
  setup(props) {
    const commonStore = userCommonStoreHook()
    // tab
    const tabsData: TabsItem[] = reactive([
      {
        text: '基本信息',
        type: 'base_info'
      },
      {
        text: '经营场所',
        type: 'business_place'
      },
      {
        text: '贷款需求',
        type: 'loan_demand'
      }
    ])
    const step = ref<number>(1)
    const tabActive = ref<TabsItemType>('base_info')
    // 字典
    const industryTypePicker = ref<boolean>(false) // 行业类型选择器
    const industryTypeList = ref<DictListItem[]>([]) // 行业类型字典
    const businessTypePicker = ref<boolean>(false) // 经营主体类型选择器
    const businessTypeList = ref<DictListItem[]>([]) // 经营主体类型字典
    // 表单
    const formRef = ref<FormInstance>()
    const form = reactive({
      baseInfo: {
        enterpriseName: '', // 企业名称
        uscc: '', // 统一社会信用代码
        industryType: '', // 行业类型
        industryTypeName: '', // 行业类型名称
        businessType: '', // 经营主体类型
        businessTypeName: '', // 经营主体类型名称
        businessRemark: '', // 经营主体类型备注
        enterpriseType: '', // 企业类型
        enterpriseTypeName: '', // 企业类型名称
        enterpriseRemark: '', // 企业备注
        stockRight: '', // 股权情况
        contactPerson: '', // 联系人
        contactPhone: '', // 联系电话
        businessAddress: '', // 实际经营地址
        assignArea: '420000', // 区划
        isDraft: '0' // 是否暂存
      }
    })
    // 获取行业类型字典
    const getIndustryType = async () => {
      const result: DictListItem[] = await commonStore.getDict('microEnterpriseIndustry')
      industryTypeList.value = listToTree(
        result.map(item => {
          return {
            text: item.name,
            ...item
          }
        }),
        'id',
        'pId',
        'children'
      )
    }
    // 获取经营主体类型字典
    const getBusinessType = async () => {
      const result: DictListItem[] = await commonStore.getDict('microEnterpriseSubject')
      businessTypeList.value = result.map(item => {
        return {
          text: item.name,
          ...item
        }
      })
    }
    // 上一步
    const handlePrev = () => {
      step.value--
    }
    // 下一步
    const handleNext = () => {
      step.value++
      // formRef.value?.validate().then(() => {
      //   step.value++
      // })
    }
    const onSubmit = () => {
      console.log('onSubmit')
    }
    onMounted(() => {
      // 获取行业类型字典
      getIndustryType()
      // 获取经营主体类型字典
      getBusinessType()
    })
    return {
      tabsData,
      step,
      tabActive,
      industryTypePicker,
      industryTypeList,
      businessTypePicker,
      businessTypeList,
      formRef,
      form,
      validateMobile,
      handlePrev,
      handleNext,
      onSubmit
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
