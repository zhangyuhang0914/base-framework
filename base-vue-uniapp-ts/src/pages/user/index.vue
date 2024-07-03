<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar headerBackground="#DAECFE" statusBackground="#DAECFE" headerTitle="我的")
    template(#main)
      view.layoutMain
        .mainContainer
          view.userMain
            scroll-view.scrollView(scroll-y)
              view.topUserInfo(:style="{ backgroundImage: `url(${preview(imgConstant.wx_user_topBg)})`, backgroundRepeat: 'no-repeat', backgroundSize: '100%' }")
                view.userInfo
                  template(v-if='token')
                    button.userImg(open-type="chooseAvatar" @chooseavatar='chooseavatar' :class='{noAvatarUrl: !userInfo.userTxId}')
                      img.img(v-if="userInfo.userTxId" :src="preview(userInfo.userTxId)")
                      view.notice(v-else) {{'点击获取头像'}}
                    view
                      view.userName {{'用户：'}}{{maskPhoneNumber(userInfo.mobilePhone)}}
                      view.enterpriseName {{'企业名称：'}}{{userInfo.entName || '未绑定企业'}}
                  template(v-else)
                    view.userImg.weidelutouxiang
                      view.iconfont.icon-weidelutouxiang
                    view.loginBtn(@click='handleLogin') {{'点击登录'}}
                up-row.rowBox(gutter="20")
                  up-col(span="6")
                    view.totalCount
                      view.totalName {{'申请融资'}}
                      view.totalInfo
                        view.applyCotunt {{userInfo.financingNeedsNum || 0}}
                        view.applyUnit {{ '万元' }}
                  up-col(span="6")
                    view.totalCount
                      view.totalName {{'成功融资'}}
                      view.totalInfo
                        view.financeCount {{userInfo.loanNum || 0}}
                        view.financeUnit {{ '笔' }}
              .cellGroup
                up-cell-group(:border="false")
                  up-cell(
                    v-for='cItem in cellList'
                    :key="cItem.name"
                    :title="cItem.title"
                    :name="cItem.name"
                    :value="cItem.value"
                    :isLink="cItem.isLink"
                    @click="handleCell(cItem)")
                    template(#icon)
                      view.iconfont(:class='cItem.icon')
            LoginValidateModal(ref='loginValidateRef' :type='loginValidateType')
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import { computed, reactive, ref } from 'vue'
import { linkJump } from '@/common/common'
import { getLocalImgToBase64, maskPhoneNumber } from '@/util/utils'
import type { CellItem } from '@/api/user/type'
import { upload, preview } from '@/api/common'
import { userCommonStoreHook } from '@/store/modules/common'
import { saveUserTx, wxUserInfo } from '@/api/user'
import { onShow } from '@dcloudio/uni-app'
import LoginValidateModal from './loginValidateModal/index.vue'
import imgConstant from '@/common/imgConstant'
// 登录token
let token = computed(() => {
  return userCommonStoreHook().token
})
// 用户信息
let uiasUserInfo = computed(() => {
  return userCommonStoreHook().uiasUserInfo
})
// 用户信息
let userInfo = ref({})
let loginValidateType = ref('login')
let loginValidateRef = ref()
let cellList = reactive<CellItem[]>([
  {
    title: '融资记录',
    name: 'finance',
    icon: 'icon-rongzijilu',
    pageUrl: '/pagesUser/finance/index',
    needLogin: true,
    needAuthentication: true,
    isLink: true
  },
  {
    title: '企业身份认证',
    name: 'enterpriseAuthentication',
    icon: 'icon-qiyeshenfenrenzheng',
    value: '未完成认证，请先完成认证',
    pageUrl: '/pagesUser/enterpriseAuthentication/index',
    needLogin: true,
    needAuthentication: false,
    isLink: true
  },
  {
    title: '企业管理',
    name: 'enterpriseManagement',
    icon: 'icon-qiyeguanli',
    pageUrl: '/pagesUser/enterpriseManagement/index',
    needLogin: true,
    needAuthentication: false,
    isLink: true
  },
  {
    title: '账号管理',
    name: 'accountManagement',
    icon: 'icon-zhangxiaoguanli',
    pageUrl: '/pagesUser/accountManagement/index',
    needLogin: true,
    needAuthentication: false,
    isLink: true
  },
  {
    title: '产品收藏',
    name: 'productCollection',
    icon: 'icon-chanpinshouzang',
    pageUrl: '/pagesUser/productCollection/index',
    needLogin: true,
    needAuthentication: true,
    isLink: true
  },
  {
    title: '关于鄂融通',
    name: 'about',
    icon: 'icon-guanxuerongtong',
    pageUrl: '/pagesUser/about/index',
    needLogin: false,
    needAuthentication: false,
    isLink: true
  }
])
// 获取企业信息
const getUserInfo = () => {
  let params = {
    userId: uiasUserInfo.value.userId
  }
  wxUserInfo(params).then(res => {
    let data = res.data || {}
    userInfo.value = data
    let entList = data.entList || []
    // 如果绑定了企业则不需要“企业身份认证操作”
    if (entList && entList.length) {
      cellList[1].isLink = false
      cellList[1].value = '已完成认证'
    } else {
      cellList[1].isLink = true
      cellList[1].value = '未完成认证，请先完成认证'
    }
    // 更新当前绑定企业信息
    let currentEnt = userInfo.value.entList.find(item => item.userId === userInfo.value.entUserId)
    userCommonStoreHook().setEntInfo(currentEnt || {})
  })
}
const handleCell = (item: CellItem) => {
  // 如果绑定了企业则不需要“企业身份认证操作”
  if (item.name === 'enterpriseAuthentication' && userInfo.value.entList && userInfo.value.entList.length) {
    return
  }
  // 登录提示
  if (item.needLogin && !token.value) {
    loginValidateType.value = 'login'
    loginValidateRef.value.init()
    return
  }
  // 绑定企业信息提示
  if (item.needAuthentication && !userInfo.value.entName) {
    loginValidateType.value = 'authentication'
    loginValidateRef.value.init()
    return
  }
  linkJump(item.pageUrl)
}
// 头像昵称填写能力
const chooseavatar = (e: AnyObject) => {
  upload(e.detail.avatarUrl).then(value => {
    let data = value.data[0]
    saveAvatarUrl(data.id)
  })
}

// 保存用户头像
const saveAvatarUrl = (id: string) => {
  let params = {
    userTxId: id,
    userId: uiasUserInfo.value.userId
  }
  saveUserTx(params).then(res => {
    userInfo.value.userTxId = id
  })
}
// 登录
const handleLogin = () => {
  linkJump('/pagesCommon/login/index')
}
// 重置数据
const resetInitData = () => {
  userInfo.value = {}
  cellList[1].isLink = true
  cellList[1].value = '未完成认证，请先完成认证'
}
onShow(() => {
  resetInitData()
  token.value && getUserInfo()
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
