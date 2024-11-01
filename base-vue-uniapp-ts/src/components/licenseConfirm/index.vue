<template lang="pug">
view.licenseConfirm
  view.confirmMain
    up-checkbox-group(v-model="isAgree")
      up-checkbox(name="1" disabled)
    view.agreeItem(@click='handleConfirm') {{'确认授权对象'}}
  u-button.send-code-btn.license-btn(type="primary" @click="onSignLicense") {{ contract.contractFileId ? '重新签署授权协议' : '签署授权协议' }}
    //- view.agreeItem.iconfont.icon-shizhi(:class='{disableColor: !isAgree}' @click='handlePreviewConfirm')
    //- view.downBtn(@click='handleDownload')
    //-   view.iconfont.icon-xiazai(:class='{disableColor: !isAgree}')
    //-   Text(:class='{disableColor: !isAgree}') {{'下载'}}
  up-modal.custromModel(v-if="confirmShow" :show="confirmShow" :showConfirmButton='false' :showCancelButton='false')
    template(#default)
      view.modalContent
        view.modalTitle.text-center {{'确认授权对象'}}
        scroll-view.modalBody(scroll-y)
          view.uniscBox
            view.label 授权方：
            view.value {{confirmData.entName}}
          view.uniscBox
            view.label 统一社会信用代码：
            view.value {{confirmData.uniscId}}
          view.uniscBox
            view.label 被授权方：
            view.value {{licensedData.entName}}
          view.uniscBox
            view.label 统一社会信用代码：
            view.value {{licensedData.uniscId}}
        view.modalBottom
          up-button(
            text="取消"
            shape="circle"
            :customStyle="{background: '#f1f1f1', width: '90%'}"
            @click='handleConfirmCancel')
          up-button(
            :disabled='disConfirmFlg'
            type="primary"
            text="确定"
            :customStyle="{width: '90%', background: '#4c5f99', border: 'none'}"
            shape="circle"
            @click='handleConfirmSubmit')
  up-modal.custromModel(v-if="previewShow" :show="previewShow" :showConfirmButton='false' :showCancelButton='false')
    view.modalContent
      view.modalTitle.text-center {{'授权协议'}}
      scroll-view.modalBody(scroll-y)
        view.text-center 企业信用信息查询授权协议
        view 重要提示:
        view {{confirmData.entName}}，统一社会信用代码{{confirmData.uniscId}}：拟向{{licensedData.entName}}申请办理融资业务,为便于金融机构在湖北省中小企业融资信用平台（以下简称“平台”）进行信用查询，本企业在此不可撤销地同意并授权如下:
        view 一、授权内容：
        view 湖北省中小企业融资信用平台有权自行或通过合作第三方(包括国家机关、法律法规授权的具有管理公共事务职能的组织及群团组织以及信用服务机构、行业协会和其他企业事业单位和组织等)收集保存、加工分析、传递查询、核实本公司相关企业信息及行为数据,包括但不限于:
        view 1.企业向相关政府部门提供的和相关政府部门在管理工作中产生的信息；
        view 2.企业在生产经营过程中，因使用公共服务（包括但不限于电力、供水、废物处理、污水处理、燃气供应、交通、通讯、网络等）而留存在公共事业单位中的信息；
        view 3.合法采集企业相关信息的第三方提供的信息（包括但不限于金融机构和其他商业机构的贷款及偿还记录、合同履约记录、涉诉涉案记录）；
        view 4.企业在平台业务中持续产生的融资流程、融资结果数据及其他数据、信息等；
        view 5.国家法律、行政法规、部门规章、地方性法规未禁止征信机构采集的与授权企业有关的其他信息。
        view 本企业在此授权平台可以从政府部门、公共事业单位、金融机构、行业协会、社会团体、互联网信息平台渠道、征信公司、其他商业机构等相关部门和单位采集上述信息（包括历史信息及更新）。本企业在此授权上述有关部门和单位可以依据本授权径行向平台提供本企业上述信息，而无需再逐一向企业另行获取授权。
        view 二、本企业允许将上述相关信息及行为数据提供给{{licensedData.entName}}，仅供融资评估参考使用。
        view 三、授权书生效
        view 本企业确认并同意，自授权书签订（含网上点击同意形式）之日起生效。
        view 四、本企业保证安全保管账户及账户密码，对账户下进行的操作行为负责。
        view 五、本企业已知悉本授权书全部内容的含义及因此产生的法律效力，自愿作出以上授权。本授权书是本企业真实意思表示，本企业同意承担由此带来的一切法律后果。
        view
          b 特别提示:
        view 为保障您的合法权益，您应当阅读并遵守本授权书。请您务必审慎阅读,并充分理解本授权书的全部内容。若您不接受本授权书的任何条款，请您立即停止授权。
        view 本授权书经签订（含网上点击同意形式）后即时生效，且效力具有独立性,不因相关业务合同或条款无效或被撤销而无效或失效。
        view.text-right
          view 企业法人：{{confirmData.legalName || entInfo.legalName}}
          view 经办人：{{confirmData.agentName || uiasUserInfo.name}}
          view 签署日期：{{moment(new Date()).format('YYYY年MM月DD日')}}
      view.modalBottom
        up-button(
          text="确定"
          shape="circle"
          :customStyle="{background: '#f1f1f1', width: '90%'}"
          @click='handlePreviewCancel')
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { userCommonStoreHook } from '@/store/modules/common'
import moment from 'moment'
import { saveFileCredit } from '@/api/user'
import { downloadFile } from '@/api/common'
import { handleDownloadFile } from '@/util/utils'
import { toast } from '@/common/uni-utils'
import type { ConfirmData } from '@/api/user/type'
import type { ContractDataType } from '@/api/common/types'
const props = defineProps({
  // 确认授权对象
  confirmData: {
    type: Object as () => ConfirmData,
    default() {
      return {} as ConfirmData
    }
  },
  // 被授权对象
  licensedData: {
    type: Object as () => ConfirmData,
    default() {
      return {
        entName: '',
        uniscId: ''
      } as ConfirmData
    }
  },
  // 授权协议
  contract: {
    type: Object as () => ContractDataType,
    default: () => {}
  }
})
let confirmDataHis = ref({})
let disConfirmFlg = computed(() => {
  return !!(
    JSON.stringify(confirmDataHis.value) ===
      JSON.stringify({
        uniscId: props.confirmData.uniscId,
        entName: props.confirmData.entName
      }) && licenseId.value
  )
})
const $emit = defineEmits(['onLicenseConfirm', 'onSignLicense'])
let isAgree = ref()
let confirmShow = ref(false)
let previewShow = ref(false)
let licenseId = ref()
// 用户信息
let uiasUserInfo = userCommonStoreHook().uiasUserInfo
let entInfo = userCommonStoreHook().entInfo
// 确认授权对象
const handleConfirm = () => {
  if (!props.confirmData.entName || !props.confirmData.uniscId) {
    toast.show('请先填写企业名称和统一社会信用代码')
    return
  }
  confirmShow.value = true
}
// 取消
const handleConfirmCancel = () => {
  confirmShow.value = false
}
// 签署授权协议
const onSignLicense = () => {
  $emit('onSignLicense')
}
// 提交
const handleConfirmSubmit = () => {
  let params = {
    uniscid: props.confirmData.uniscId,
    entName: props.confirmData.entName,
    // 91420000MAC45WE57R
    finInstitutionsUniscID: props.licensedData.uniscId || '',
    // 湖北省征信有限公司
    finInstitutionsName: props.licensedData.entName || '',
    finLoanInstitutionsInfoIds: '1',
    finLoanInstitutionsInfoIdsArr: ['1'],
    contactMan: entInfo.entInfoagentName || uiasUserInfo.name
  }
  saveFileCredit(params).then(result => {
    confirmShow.value = false
    isAgree.value = ['1']
    licenseId.value = result.licenseId
    confirmDataHis.value = {
      uniscId: props.confirmData.uniscId,
      entName: props.confirmData.entName
    }
    $emit('onLicenseConfirm', licenseId.value)
  })
}
// 查看授权协议
const handlePreviewConfirm = () => {
  if (!isAgree.value) {
    return
  }
  previewShow.value = true
}
// 关闭查看协议弹框
const handlePreviewCancel = () => {
  previewShow.value = false
}
// 下载协议
const handleDownload = () => {
  if (!isAgree.value) {
    return
  }
  let url = downloadFile(licenseId.value)
  let isImg = ''
  let fileType = 'pdf'
  handleDownloadFile(url, isImg, fileType)
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
