<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack statusBackground="#132B5B" headerBackground="#132B5B" headerColor="#FFFFFF" headerTitle="企业管理")
    template(#main)
      view.layoutMain
        .mainContainer
          scroll-view.scrollView(scroll-y)
            view.upFormBox
              up-form(labelPosition="left" labelWidth='110')
                up-form-item(label="当前登录企业")
                  CUniappPicker.c-uniapp-picker(:columns="entList" :defaultName="currentEntInfo.entName" keyName="entName" placeholder="请选择企业" @confirm="onEntSelect")
                    template(#right)
                      up-icon(name='arrow-right' color='#909399')
                .tips
                  view.title {{'企业信息'}}
                up-form-item(label="统一社会信用代码" labelWidth='140')
                  view.formItemH50 {{currentEntInfo.entUnitCode || '无'}}
                //- up-form-item(label="信用授权截止日期" labelWidth='140')
                //-   view.formItemH50 {{currentEntInfo.authorizedEndTime ? moment(currentEntInfo.authorizedEndTime).format('YYYY-MM-DD') : '无'}}
                .tips
                  view.title {{'绑定用户信息'}}
                up-form-item.account-operation(:label="item.name" v-for='item in userList' :key='item.id' )
                  view.formItemH50
                    up-button.u-primary(
                      v-if="item.userId === uiasUserInfo.userId || isAgentPerson"
                      type="primary"
                      text="解绑"
                      @click='handleUnbind(item)')
              view.bottomBtn.u-big-btn
                up-button.u-primary(
                  icon="plus-circle-fill"
                  iconColor="#E5F0FF"
                  type="primary"
                  text="添加企业"
                  @click="handleAdd")
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import { userCommonStoreHook } from '@/store/modules/common'
import { linkJump } from '@/common/common'
import { computed, reactive, Ref, ref, watch } from 'vue'
import CUniappPicker from '@/components/c-uniapp-picker/index.vue'
import moment from 'moment'
import { uiasEntInfo, uiasUnbindUser, uiasSwitchEnt, wxUserInfo, queryByEntUser } from '@/api/user'
import { toast } from '@/common/uni-utils'
import type { EntInfoType, UiasUserInfoType } from '@/api/common/types'
import { onShow } from '@dcloudio/uni-app'
// 用户信息
let uiasUserInfo = userCommonStoreHook().uiasUserInfo as UiasUserInfoType
const entInfo: Ref<Partial<EntInfoType>> = computed((): EntInfoType | {} => {
  return userCommonStoreHook().entInfo
})
// 当前绑定企业信息
const currentEntInfo: Ref<Partial<EntInfoType>> = ref({})
let entList: EntInfoType[] = reactive([])
const userList: Ref<UiasUserInfoType[]> = ref([])
const isAgentPerson = ref<boolean>(false)
// 选择登录企业
const onEntSelect = (data: EntInfoType) => {
  if (['noData'].includes(data.id)) return
  if (data.userId === entInfo.value?.userId) return
  currentEntInfo.value = data
  let params = {
    entUserId: currentEntInfo.value?.userId,
    userId: uiasUserInfo.userId
  }
  uiasSwitchEnt(params).then(value => {
    toast.show('更换成功', 'success')
    userCommonStoreHook().setEntInfo(currentEntInfo.value as EntInfoType)
    getEntInfoUias()
    getQueryByEntUser()
  })
}
// 添加企业
const handleAdd = () => {
  linkJump('/pagesUser/enterpriseAuthentication/index')
}
// 获取绑定企业列表
const getEntList = () => {
  let params = {
    userId: uiasUserInfo.userId
  }
  wxUserInfo(params).then(res => {
    let data = res.data || {}
    if (data.entList && data.entList.length) {
      entList = data.entList
    } else {
      entList = [{ id: 'noData', entName: '您还未绑定企业' }]
    }
    console.log('entList', entList)
    // 更新当前绑定企业信息
    let currentEnt: Partial<EntInfoType> = entList.find((item: EntInfoType) => item.userId === data.entUserId) as EntInfoType
    userCommonStoreHook().setEntInfo((currentEnt as EntInfoType) ?? {})
    currentEntInfo.value = currentEnt ?? {}
    getQueryByEntUser()
    getEntInfoUias()
  })
}
// 查询当前用户是否是经办人
const getQueryByEntUser = () => {
  if (!currentEntInfo.value?.userId) return
  const params = {
    // 企业 ID
    entUserId: currentEntInfo.value?.userId,
    // 用户手机号
    mobile: uiasUserInfo.mobilePhone
  }
  queryByEntUser(params).then(result => {
    isAgentPerson.value = result.data
  })
}
// 获取绑定人列表
const getEntInfoUias = () => {
  if (!currentEntInfo.value?.userId) {
    return
  }
  let params = {
    entUserId: currentEntInfo.value?.userId
  }
  uiasEntInfo(params).then(value => {
    let data: AnyObject = value.data || {}
    userList.value = data.userList || []
  })
}
// 解绑用户
const handleUnbind = (item: UiasUserInfoType) => {
  console.log('handleUnbind', item)
  uni.showModal({
    content: `您确定解绑${item.name}吗?`,
    success: (result: UniApp.ShowModalRes) => {
      if (result.confirm) {
        let params = {
          entUserId: currentEntInfo.value?.userId,
          userId: item.userId
        }
        uiasUnbindUser(params).then((value: AnyObject) => {
          toast.show(value.msg, 'success')
          // 判断解绑的是否是自己
          if (uiasUserInfo.userId === item.userId) {
            if (value.entList && value.entList.length) {
              entList = value.entList
            } else {
              entList = [{ id: 'noData', entName: '您还未绑定企业' }]
            }
            userList.value = value.userList || []
            // 如果解绑是当前登录企业，则置空
            if (currentEntInfo.value?.userId === entInfo.value?.userId) {
              userCommonStoreHook().setEntInfo({})
            }
            // 更新当前绑定企业信息
            let currentEnt = entList.find((item: EntInfoType) => item.userId === currentEntInfo.value?.userId) as EntInfoType
            currentEntInfo.value = currentEnt || {}
            // 更新绑定人列表
            getEntInfoUias()
            console.log('currentEntInfo', currentEntInfo.value)
          } else {
            // 更新绑定人列表
            getEntInfoUias()
          }
        })
      }
    }
  })
}
onShow(() => {
  getEntList()
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
