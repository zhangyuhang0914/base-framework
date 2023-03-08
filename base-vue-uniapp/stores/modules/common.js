import { defineStore } from 'pinia'
import { store } from "../index"
import { linkJump } from '@/common/common'

// const { BASE_URL } = import.meta.env

export const userCommonStore = defineStore({
  id: 'common',
  state: () => {
    return {
      expire: '',
      hasSupeRole: false,
      toekn: '',
      userRole: [], // 用户职位
      userInfo: {}, // 用户信息
      tabBar: {
        selectIndex: 0,
        showTabBar: true,
        list: [
          {
            pagePath: '/src/pages/index/index',
            iconPath: '/src/static/images/common/index.png',
            selectedIconPath: '/src/static/images/common/select-index.png',
            text: '首页'
          }, {
            pagePath: '/src/pages/affairs/index',
            iconPath: '/src/static/images/common/affairs.png',
            selectedIconPath: '/src/static/images/common/select-affairs.png',
            text: '办事'
          }, {
            pagePath: '/src/pages/work-service/index',
            iconPath: '/src/static/images/common/work-service.png',
            selectedIconPath: '/src/static/images/common/select-work-service.png',
            text: '服务'
          }, {
            pagePath: '/src/pages/user/index',
            iconPath: '/src/static/images/common/user.png',
            selectedIconPath: '/src/static/images/common/select-user.png',
            text: '我的'
          }
        ]
      },
    }
  },
  actions: {
    setTabBar (selectIndex = 0, show = true) {
      this.tabBar.selectIndex = selectIndex
      this.tabBar.showTabBar = show
      linkJump(this.tabBar.list[selectIndex].pagePath)
    },
    setSystemInfo (data = {}) {
      this.expire = data.expire
      // 控制个人中心账号审核菜单
      this.hasSupeRole = data.hasSupeRole
      this.token = data.token
      // 控制个人中心部门办件菜单，集合中存在200则展示部门办件
      this.userRole = data.userRole
      this.userInfo = data.userinfo
    }
  }
})

export function userCommonStoreHook () {
  return userCommonStore(store)
}
