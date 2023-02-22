import { defineStore } from "pinia"
import { store } from "../index"
import { getUserInfoById } from '@/apis/user'

interface IMType {
  imList: any,
  imMsg: AnyObject,
  userObj: AnyObject,
  nowDialogInfo: AnyObject,
  draft?: Map<string|number, any>
}
// getUserInfoById('cp')
export const userIMStore = defineStore({
  id: "IM",
  state: (): IMType => ({
    imList: [], // 消息列表
    imMsg: {}, // 消息内容
    userObj: {}, // 用户对象数据详情
    nowDialogInfo: {}, // 限制的im对话对象
    draft: new Map() // 草稿
  }),
  getters: {
    // 获取用户信息
    getUserInfo (state) {
      return async (userAccount:string, refresh: boolean=false) => {
        if (!refresh && state.userObj[userAccount]) {
          return state.userObj[userAccount]
        } else {
          let result:any = await getUserInfoById(userAccount)
          if (result && result.code + '' === '200') {
            state.userObj[userAccount] = result.data.sysUser
            return result.data.sysUser
          } else {
            return {}
          }
        }
      }
    }
  },
  actions: {
    setUserInfo (key: string | number, value: any) {
      this.userObj[key] = value
    },
    getDialogInfo (dialogId: string) {
      return this.imList.filter((item:any) => item.dialog_id == dialogId)[0] || {}
    },
    // 消息列表
    setIMList (type: string, data?: any, callback?: any) {
      switch (type) {
        case 'addRed':
          this.imList.forEach((item: AnyObject) => {
            if (item.dialog_id + '' === data.dialogId + '') {
              item.no_reader_count = item.no_reader_count ? parseInt(item.no_reader_count, 10) + 1 : 1
            }
          })
          break
        case 'reduce':
          this.imList.forEach((item: AnyObject) => {
            if (item.dialog_id + '' === data.dialogId + '' && item.no_reader_count && item.no_reader_count != '0') {
              item.no_reader_count = parseInt(item.no_reader_count, 10) - 1
            }
          })
          break
        case 'update':
          this.imList.forEach((item: AnyObject) => {
            if (item.dialog_id + '' === data.dialogId + '') {
              for (const key in item) {
                if (data[key]) {
                  item[key] = data[key]
                }
              }
            }
          })
          break
        case 'clearRed':
          console.log(data)
          this.imList.forEach((item: AnyObject) => {
            if (item.dialog_id + '' === data.dialogId + '') {
              item.no_reader_count = 0
            }
          })
          break
        case 'del':
          // 改变未读取的数据
          this.imList = this.imList.filter((item: any) => {
            return item.dialog_id + '' !== data.dialogId + ''
          })
          console.log(data, this.imList)
          this.imMsg && delete this.imMsg[data.dialogId + '']
          break
        case 'add':
          // 添加对话框判断
          console.log(this.imList)
          const flag = this.imList.some((item: any) => item.dialog_id == data.dialog_id)
          console.log(flag)
          if (!flag) {
            // this.imList.unshift(data)
            this.setIMList('topChange', {
              dialogId: data.dialog_id,
              data: data,
              type: 'addItem'
            })
            callback && callback()
          }
          break
        case 'topChange':
          let topArray:Array<any> = []
          let commonArray:Array<any> = []
          this.imList.map((item:AnyObject) => {
            if (item.is_top === '1') {
              topArray.push(item)
            } else {
              commonArray.push(item)
            }
          })
          // 添加整个消息
          if (data.type === 'addItem') {
            if (data.data.is_top === '1'){
              topArray.unshift(data.data)
            } else {
              commonArray.unshift(data.data)
            }
          } else if (data.type === 'add') {
            // 添加置顶
            let index = commonArray.findIndex((item:any) => item.dialog_id == data.dialogId)
            topArray.unshift({...commonArray[index],is_top: '1'})
            commonArray.splice(index, 1)
          } else if (data.type === 'del') {
            // 删除置顶
            let index = topArray.findIndex((item:any) => item.dialog_id == data.dialogId)
            commonArray.unshift({...topArray[index],is_top: '0'})
            topArray.splice(index, 1)
          }
          this.imList = topArray.concat(commonArray)
          break
        case 'clear':
          this.imList = []
        case 'orderToFront':
          // 当前消息是否是置顶
          let _top:Array<any> = []
          let _common:Array<any> = []
          this.imList.map((item:AnyObject) => {
            if (item.is_top === '1') {
              _top.push(item)
            } else {
              _common.push(item)
            }
          })
          // 免打扰
          if (_top.findIndex((item:any) => item.dialog_id == data.dialogId) > -1) {
            return false
          }
          // 排序
          let index = _common.findIndex((item:any) => item.dialog_id == data.dialogId)
          if (index > -1) {
            this.imList = _top.concat([_common[index]].concat(_common.filter((item: any, its: number) => {
              return index !== its
            })))
          }
          break
        case 'state':
          this.imList.forEach((item: AnyObject) => {
            if (item.dialog_id + '' === data.dialogId + '') {
              item.state = data.state
            }
          })
          break
        default :
          this.imList = data
          break
      }
    },
    /**
     * 消息内容处理
     * @param type
     * @param data - {id: dialogId, data: }
     */
    setIMMsg (type: string, data?: any) {
      switch (type) {
        // 删除消息
        case 'del':
          if (data.data.message_id) {
            this.imMsg[data.id].forEach((item:any, index:number) => {
              if(data.data.message_id + '' === item.message_id + ''){
                this.imMsg[data.id].splice(index, 1)
              }
            })
          } else {
            this.imMsg[data.id].splice(data.index, 1)
          }
          // console.log('====',this.imMsg[data.id])
        case 'withdraw':
          this.imMsg[data.id].forEach((item:any, index:number) => {
            if(data.data.message_id + '' === item.message_id + ''){
              item.type = 'withdraw'
              item.ignoreFlag = '1' // 是否是忽略的消息 -- 查列表和已阅的时候要排除
              this.setIMList('reduce', {
                dialogId: data.id
              })
            }
          })
          break
        // 添加消息
        case 'add':
          console.log(data)
          // this.imMsg[data.id].push(data.data)
          const flag = this.imMsg[data.id].some((its:any) => its.message_id == data.data.message_id)
          !flag && this.imMsg[data.id].push(data.data)
          // 如果是回复类型
          if (data.data.par_message_id) {
            this.imMsg[data.id] && this.imMsg[data.id].forEach((item:any) => {
              if (item.message_id == data.data.par_message_id && (!item.replay_message_lists || !(item.replay_message_lists.includes(data.data.message_id+'')))) {
                item.reply_message_num = parseInt((item.reply_message_num ||0) + '') + 1
                item.replay_message_lists = item.replay_message_lists ? item.replay_message_lists.concat([data.data.message_id+'']) : [data.data.message_id+'']
              }
            })
          }
          this.setIMList('orderToFront', {
            dialogId: data.id
          })
          break
        // 添加消息
        case 'unshift':
          console.log(data)
          this.imMsg[data.id].unshift(...data.data)
          break
         // 中间加消息
         case 'middlePut':
          let _d:any = this.imMsg[data.id]
          _d.forEach((item:any, index:any) => {
            if (item.message_id == data.msgId){
              item.lastLoad = false
              _d.splice(index+1,0,...data.data)
            }
          })
          break
        case 'progress':
          this.imMsg[data.id].forEach((its:any) => {
            if (its.message_id == data.data.message_id) {
              its.type = 'progress'
              its.progress = data.data.progress
            }
          })
          break
        case 'error':
          this.imMsg[data.id].forEach((its:any) => {
            if (its.message_id == data.data.message_id) {
              its.type = 'error'
            }
          })
          break
        // 超时
        case 'timeout':
          this.imMsg[data.id].forEach((its:any) => {
            if (its.message_id == data.data.message_id) {
              its.type = 'timeout'
            }
          })
          break
        // 发送成功
        case 'sendOk':
          this.imMsg[data.id].forEach((its:any) => {
            if (its.message_id == data.data.message_id && !(its.ignoreFlag)) {
              its.type = 'ok'
            }
          })
          break
        case 'sendFile':
          this.imMsg[data.id].forEach((its:any) => {
            if (its.message_id == data.data.message_id) {
              its.type = 'loading'
              its.message_content = data.data.message_content
            }
          })
          break
        // 更新收到字段
        case 'updateReceive':
          this.imMsg[data.id] && this.imMsg[data.id].forEach((its:any) => {
            if (its.message_id + '' === data.data.message_id + '') {
              let _flag = its.receive_list && its.receive_list.some((itsSome:any) => itsSome.userAccount == data.data.item.userAccount)
              if (_flag){
                return false
              }
              its.receive_list = its.receive_list?its.receive_list.concat(data.data.item): [data.data.item]
            }
          })
          break
        // 更新已阅
        case 'read':
          let _index = this.imMsg[data.id] && this.imMsg[data.id].findIndex((its: AnyObject) => its.message_id + '' === data.data.message_id + '')
          this.imMsg[data.id] && this.imMsg[data.id].forEach((its:any, itsIndex: number) => {
            // 之前的消息已阅
            if ((_index === 0 || _index) && itsIndex <= _index) {
              its.is_read = 1
              if (its.not_read_users) {
                its.not_read_users = its.not_read_users.filter((items:any) => {
                  return items.user_name != data.data.fromId
                })
              }
            }
          })
          break
        default:
          this.imMsg[data.id] = data.data
          break
      }
    },
    // 对话框是否存在
    dialogIn (dialogId: string) {
      let flag = this.imList.some((item: AnyObject) => item.dialog_id == dialogId)
      // 不存在
     return flag
    },
    setNowDialog (dialogInfo: AnyObject = {}) {
      this.nowDialogInfo = dialogInfo
    },
    setDraft (type: string, dialogId: string, content?: any) {
      switch (type) {
        case 'add':
          this.draft?.set(dialogId, content)
          break
        case 'del':
          this.draft?.delete(dialogId)
          break
        case 'clear':
          this.draft?.clear()
          break
      }
    },
    getDraft (dialogId: string) {
      return this.draft?.get(dialogId) ?? ''
    }
  }
})

export function userIMStoreHook() {
  return userIMStore(store);
}
