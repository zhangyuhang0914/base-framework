<template lang="pug">
.page-wrap
  .entry-main
    .entry-content
      .entry-title {{ enterpriseInfo.name || '' }}
      .operation-btn
        vanButton.custom-primary-btn(
          v-for="(item, index) in operationActionBtn"
          :key="index"
          :type="item.type"
          @click="handlerOperation(item.path)"
        )
          img(:src="item.icon" alt="加载失败")
          span.custom-button__text {{ item.text }}
</template>

<script lang="ts">
import { webEnterprisesInfo } from '@/api/common'
import type { EnterpriseInfoType } from '@/api/model'
import type { ApiResponse } from '@/common/http/types'
import { userCommonStoreHook } from '@/stores/modules/common'
import { computed, defineComponent, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface OperationBtnType {
  text: string
  type: string
  authentication: 'enterprise' | 'team'
  icon: string
  path: string
}
type AuthenticationType = OperationBtnType['authentication']
export default defineComponent({
  name: 'Entry',
  setup(props) {
    const { VITE_APP_IMG_URL } = import.meta.env
    const router = useRouter()
    const route = useRoute()
    const loginMode = (route.query as { loginMode: AuthenticationType }).loginMode ?? ''
    const commonStore = userCommonStoreHook()
    const operationBtn: OperationBtnType[] = reactive([
      {
        text: '我的需求申报',
        type: 'default',
        authentication: 'enterprise',
        icon: VITE_APP_IMG_URL + 'entry/enterpriseApply.png',
        path: '/demandBusiness/enterpriseApply'
      },
      {
        text: '我的需求进度',
        type: 'default',
        authentication: 'enterprise',
        icon: VITE_APP_IMG_URL + 'entry/enterpriseDemandProgress.png',
        path: '/demandBusiness/demandProgress'
      },
      {
        text: '企业需求申报',
        type: 'default',
        authentication: 'team',
        icon: VITE_APP_IMG_URL + 'entry/teamApply.png',
        path: '/demandBusiness/teamApply'
      },
      {
        text: '企业申请列表',
        type: 'default',
        authentication: 'team',
        icon: VITE_APP_IMG_URL + 'entry/teamApplyRecord.png',
        path: '/demandBusiness/enterpriseApplyRecord'
      },
      {
        text: '我的需求进度',
        type: 'default',
        authentication: 'team',
        icon: VITE_APP_IMG_URL + 'entry/teamDemandProgress.png',
        path: '/demandBusiness/demandProgress'
      }
    ])
    // 获取企业信息
    const getEnterprisesInfo = () => {
      webEnterprisesInfo()
        .then((result: ApiResponse<EnterpriseInfoType>) => {
          commonStore.setEnterpriseInfo(result.data ?? {})
        })
        .catch((error: Error) => {
          console.log('error', error)
        })
    }
    const handlerOperation = (path: string) => {
      router.push({
        path: path
      })
    }
    const operationActionBtn = computed(() => {
      return operationBtn.filter(item => item.authentication === loginMode)
    })
    const enterpriseInfo = computed(() => {
      return commonStore.enterpriseInfo
    })
    onMounted(() => {
      getEnterprisesInfo()
    })
    return {
      loginMode,
      operationActionBtn,
      enterpriseInfo,
      handlerOperation
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
