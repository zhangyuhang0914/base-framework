import { defineStore } from 'pinia'
import { store } from '@/store/index'
import { goBack, linkJump } from '@/common/common'
import type { CommonType } from './types'
import { getDictParamData } from '@/api/index'
import type { DictListItem } from '@/api/index/types'
import type { ApiResponse } from '@/common/http/types'
import type { UiasUserInfoType, EntInfoType } from '@/api/common/types'
import type { ProductListItem } from '@/api/financeProduct/types'
import Bus, { REFRESH } from '@/common/bus'
import { setStorage, getStorage } from '@/util/storage'

export const commonStore = defineStore({
  id: 'common',
  state: (): CommonType => ({
    token: getStorage('token'),
    uiasUserInfo: getStorage('uiasUserInfo'),
    entInfo: getStorage('entInfo'),
    tabBar: {
      selectName: '首页',
      selectIndex: 0,
      showTabBar: true,
      list: [
        {
          pagePath: '/pages/index/index',
          iconPath: 'icon-shouye',
          selectedIconPath: 'icon-shouye',
          text: '首页'
        },
        {
          pagePath: '/pages/financeProduct/index',
          iconPath: 'icon-jinrongchanpin2',
          selectedIconPath: 'icon-jinrongchanpin2',
          text: '金融产品'
        },
        {
          pagePath: '/pages/policyNews/index',
          iconPath: 'icon-zhengcexinwen',
          selectedIconPath: 'icon-zhengcexinwen',
          text: '政策新闻'
        },
        {
          pagePath: '/pages/user/index',
          iconPath: 'icon-wodi',
          selectedIconPath: 'icon-wodi',
          text: '我的'
        }
      ]
    },
    tabBarHeight: 0,
    dictData: {}, // 字典集合
    productContrastList: [] // 产品对比列表
  }),
  actions: {
    // token
    setToken(token: string) {
      this.token = token
      setStorage('token', token)
    },
    // tabbar栏
    setTabBar(selectIndex: number = 0, selectName: string, show: boolean = true, callBack?: Function) {
      this.tabBar.selectIndex = selectIndex
      this.tabBar.selectName = selectName
      this.tabBar.showTabBar = show
      linkJump(this.tabBar.list[selectIndex].pagePath, () => {
        callBack && callBack()
      })
    },
    setTabBarHeight(data: number) {
      this.tabBarHeight = data
    },
    setDict(key: string, data: DictListItem[]) {
      this.dictData[key] = data
    },
    getDict(key: string): Promise<DictListItem[]> {
      return new Promise((resolve, reject) => {
        if (!this.dictData[key]) {
          getDictParamData(key).then((result: ApiResponse<DictListItem[]>) => {
            this.setDict(key, result.data)
            resolve(result.data)
          })
        } else {
          resolve(this.dictData[key])
        }
      })
    },
    clearDict() {
      this.dictData = {}
    },
    /**
     * 清空数据
     * @param isRefresh 是否刷新（首页、金融产品）
     * @param toast 退出登录后提示语
     * @param isLogin 退出登录后是否跳转登录
     */
    logout(isRefresh: boolean = true, toast?: string, isLogin: boolean = false) {
      this.setToken('')
      // @ts-ignore
      this.setUiasUserInfo({})
      // @ts-ignore
      this.setEntInfo({})
      isRefresh && Bus.$emit(REFRESH, true)
      if (isLogin) {
        goBack({}, () => {
          uni.$u.toast('修改成功')
        })
      } else {
        this.setTabBar(3, '我的', true, () => {
          toast && uni.$u.toast(toast)
        })
      }
    },
    setUiasUserInfo(uiasUserInfo: UiasUserInfoType) {
      this.uiasUserInfo = uiasUserInfo
      setStorage('uiasUserInfo', uiasUserInfo)
    },
    setEntInfo(entInfo: EntInfoType) {
      this.entInfo = entInfo
      setStorage('entInfo', entInfo)
    },
    setProductContrastList(data: ProductListItem, type: string, id?: string) {
      if (type === 'push') {
        this.productContrastList.push(data)
      } else if (type === 'delete') {
        this.productContrastList = this.productContrastList.filter((its: ProductListItem) => its.id !== data.id)
      } else if (type === 'replace') {
        const index = this.productContrastList.findIndex((item: ProductListItem) => item.id === id)
        this.productContrastList[index] = data
      }
    }
  },
  getters: {}
})

export function userCommonStoreHook() {
  return commonStore(store)
}
