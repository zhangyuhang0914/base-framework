import { defineStore } from "pinia"
import { store } from "../index"
import { storageLocal } from '@/utils/storage/index'
import { getSysParams, getSysDict } from '@/apis/system'
import exesocket from '@/commons/exe-methods'
let lang = storageLocal.getItem("responsive-locale")?.locale ?? 'zh_CN'
import { removeToken } from '@/utils/cookie'

import { nextTick } from "vue"
import router from "@/routers/index"
interface commonType {
  userBaseInfo: AnyObject,
  sysParam: AnyObject,
  dictList: AnyObject,
  cachedRoute: Array<string>,
  currentRoute: AnyObject,
  selectListMap: Map<number | string, any>,  // 选中时候数据
  selectList: Array<any>, // 选中后的数据
  selectDisabledMap: Map<string, any>, // 不可点击数据
  aliveTop: AnyObject, // 缓存的滚动
  saveUserList: Array<any>, // 保存的账号密码
  natsObj: AnyObject // 状态位置存储
}

export const userCommonStore = defineStore({
  id: "common",
  state: (): commonType => ({
    userBaseInfo: storageLocal.getItem('USER_BASE_INFO') || {},
    sysParam: {},
    dictList: {},
    cachedRoute: [],
    currentRoute: {}, // 当前路由
    selectListMap: new Map(), // 选中的数据，中间变量
    selectList: [], // 真正选中的数据
    selectDisabledMap: new Map(),
    aliveTop: {},
    saveUserList: [], //
    natsObj: {}
  }),
  getters: {
    // 获取系统参数
    getSysParam (state) {
      return (key: string) => {
        if (state.sysParam && state.sysParam[key]) {
          return state.sysParam[key]['configValue']
        } else {
          return ''
        }
      }
    },
    // 获取数据字典
    getDict (state) {
      return (key:string, val?:string | number | boolean) => {
        if (key && state.dictList && state.dictList[key]) {
          let dict = state.dictList[key]
          if (dict) {
            if (val) {
              for (let i = 0; i < dict.length; i++) {
                if (dict[i]['dictValue'] === val) {
                  return dict[i]['dictLabel']
                }
              }
            } else {
              if (val === '') {
                return ''
              }
              return dict
            }
          } else {
            return ''
          }
        } else {
          return ''
        }
      }
    }
  },
  actions: {
    // 设置用户信息
    setUserBaseInfo (userInfo: {}) {
      this.userBaseInfo = userInfo
      storageLocal.setItem('USER_BASE_INFO', userInfo)
    },
    // 设置系统参数
    setSysParams () {
      getSysParams().then((res:any) => {
        if (res.code + '' === '200') {
          let _data = res.rows || []
          let rowsObj: AnyObject = {}
          _data.map((item: any) => {
            rowsObj[item.configKey] = item
          })
          this.sysParam = rowsObj
        }
      })
    },
    // 设置数据字典
    setDict () {
      getSysDict().then((res:any) => {
        if (res.code + '' === '200') {
          this.dictList = res.rows[0] || {}
        }
      })
    },
    // 设置缓存路由
    setCached (str:string, type?: string) {
      if (type === 'del') {
        this.cachedRoute = this.cachedRoute.filter(item => item !== str)
        return false
      }
      if (!(this.cachedRoute.some(item => item === str))) {
        this.cachedRoute.push(str)
      }
    },
    // 退出做的操作
    logout () {
      try {
        storageLocal.removeItem('xAuthToken')
        this.cachedRoute = []
        storageLocal.removeItem('USER_BASE_INFO')
        // exesocket.setStorage('AUTO_LOGIN_LIST',[])
        exesocket.setStorage('LONG_TOKEN', '')
      } catch (er) {
        console.log(er)
      }
      removeToken()
      router.replace({
        name: 'Login'
      })
      nextTick(() => {
        nextTick(() => {
          window.location.reload()
        })

      })
    },

    setRouter (item: AnyObject) {
      this.currentRoute = item
    },

    // 设置选中的数据
    setSelectList (type:string, data?: Array<any>, key: string = 'nodeId') {
      if (type === 'add') {
        // let flag = Array.isArray(data)
        data?.forEach(item => {
          this.selectListMap.set(item[key] + '', item)
        })
      } else if (type === 'del') {
        data && data.map(item => {
          this.selectListMap.delete(item + '')
        })
      } else if (type === 'clear') {
        this.selectListMap.clear()
      } else {
        let dMap:Array<any> = []
        data?.forEach((item:any) => {
          dMap.push([item[key] + '', item])
        })
        this.selectListMap = new Map(dMap)
      }
    },


    // 状态位置存储
    setNatsObj (type: string, key: string, data?: AnyObject) {
      if (type === 'del') {
        delete this.natsObj[key]
      } else {
        if (this.natsObj[key]) {
          this.natsObj[key] = {...this.natsObj[key], ...data}
        } else {
          this.natsObj[key] = data
        }
      }
    },

    // 获取用户状态
    getStatus (userName: any) {
      return this.natsObj[userName]?.status
    },
    // 设置保存的账号密码
    setSaveUserList(datas: Array<any>) {
      this.saveUserList = datas
    }
  }
})

export function userCommonStoreHook() {
  return userCommonStore(store);
}
