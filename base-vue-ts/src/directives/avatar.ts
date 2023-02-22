/*
 * @Desc         : 头像指令
 * @Author       : CP
 * @Date         : 2022-04-13 09:21:45
 * @LastEditors  : LJJ
 * @LastEditTime : 2022-09-09 11:19:03
 */
'use strict'
import { useIntersectionObserver } from '@vueuse/core'
import { userCollectStoreHook } from '@/stores/modules/collect'
const { BASE_URL } = import.meta.env;
const foucsImg=BASE_URL+'images/address/special-focus.png'
const collectHook = userCollectStoreHook();
const _baseUrl = window.location.protocol + '//' + window.location.host + '/fileServer/'
// 获取当个用户信息
const getSingleInfo = (imgURL: string, NAME?: any) => {
  let fullUrl: string = ''
  if (imgURL && imgURL.indexOf('http') === 0) {
    fullUrl = imgURL
  } else if (imgURL) {
    fullUrl = _baseUrl + imgURL.replace(/^\//, '').replace(/^fileServer/, '')
  }
  if (fullUrl) {
    return `<span src="${fullUrl}"
      style="display: inline-block;width:100%;height:100%;background: url(${fullUrl}) no-repeat center;background-size: cover;)"></span>`
  } else {
    return `<span style="white-space:nowrap;transform: scale(0.8)">${NAME.slice(-1)}</span>`
  }
}
const avatarDel = (el:any, binding:any, vnode?:any) => {
  let imgURL = binding.value // 获取图片地址
  let baseUrl = el.getAttribute('base-url') || _baseUrl // 获取默认图片地址
  const fullName = el.getAttribute('full-name') || 'no' // 获取默认图片地址
  const fullId=el.getAttribute('full-id') || '' //获取用户id
  const full = el.getAttribute('full') || false // 获取默认图片地址
  const NAME = fullName.substring(fullName.length - 2)
  // 如果是群组
  let memberList = el.getAttribute('memberList')
  const imgList = (memberList ? JSON.parse(memberList) : []).slice(0, 4)

  if (imgURL) {
    if (!full && imgURL.indexOf('/') === 0) {
      imgURL = imgURL.slice(1)
    }
    let fullUrl = baseUrl + imgURL
    if (imgURL.indexOf('http') === 0) {
      fullUrl = imgURL
    }
    if (full) {
      fullUrl = imgURL
    }
    if (fullUrl) {
      //el.innerHTML = `<img src="${fullUrl}" width="100%" height="100%" style="border-radius:50%;position:relative">`
      if(collectHook.isCollect(fullId)){
        el.innerHTML = `<img src="${fullUrl}" width="100%" height="100%" style="border-radius:50%;position:relative"><img src="${foucsImg}" width="14" height="14" style="position:absolute;bottom:0;right:0">`
      }else{
        el.innerHTML = `<img src="${fullUrl}" width="100%" height="100%" style="border-radius:50%;position:relative">`
      }
    } else {
      //el.innerHTML = `${NAME}`
      if(collectHook.isCollect(fullId)){
        el.innerHTML = `<div style="width:100%;height:100%;text-align:center;line-height:38px;position:relative">${NAME}</div><img src='${foucsImg}' width="14" height="14" style="position:absolute;bottom:0;right:0">`
      }else{
        el.innerHTML = `${NAME}`
      }
    }
  } else {
    if (imgList && imgList.length > 1) {
      let showDom: any = `${NAME}`
      // 显示几个人
      switch(imgList.length){
        case 2:
          showDom = `<span style="width:100%;height:100%;overflow:hidden;position:relative;border-radius:50%;display:flex;align-items:center;justify-content:center;">
            <span style="overflow:hidden;height:100%;width:50%;display:flex;align-items:center;justify-content:center;">${getSingleInfo(imgList[0].avatar, imgList[0].nick_name || imgList[0].nickName)}</span>
            <span style="height: 100%;width:1px;background:#fff;"></span>
            <span style="overflow:hidden;height:100%;width:50%;display:flex;align-items:center;justify-content:center;">${getSingleInfo(imgList[1].avatar, imgList[1].nick_name || imgList[1].nickName)}</span>
          </span>`
          break
        case 3:
          showDom = `<span style="width:100%;height:100%;overflow:hidden;position:relative;border-radius:50%;display:flex;align-items:center;justify-content:center;">
            <span style="overflow:hidden;height:100%;width:50%;display:flex;align-items:center;justify-content:center;">${getSingleInfo(imgList[0].avatar, imgList[0].nick_name || imgList[0].nickName)}</span>
            <span style="height: 100%;width:1px;background:#fff;"></span>
            <span style="overflow:hidden;height:100%;width:50%;display: flex;flex-direction:column;">
              <span style="overflow:hidden;height:50%;width:100%;display:flex;align-items:center;justify-content:center;">${getSingleInfo(imgList[1].avatar, imgList[1].nick_name || imgList[1].nickName)}</span>
              <span style="width: 100%;height:1px;background:#fff;display: inline-block;"></span>
              <span style="overflow:hidden;height:50%;width:100%;display:flex;align-items:center;justify-content:center;">${getSingleInfo(imgList[2].avatar, imgList[2].nick_name || imgList[2].nickName)}</span>
            </span>
          </span>`
          break
        case 4:
          showDom = `<span style="width:100%;height:100%;overflow:hidden;position:relative;border-radius:50%;display:flex;align-items:center;justify-content:center;">
            <span style="overflow:hidden;height:100%;width:50%;display: flex;flex-direction:column;">
              <span style="overflow:hidden;height:50%;width:100%;display:flex;align-items:center;justify-content:center;">${getSingleInfo(imgList[0].avatar, imgList[0].nick_name || imgList[0].nickName)}</span>
              <span style="width: 100%;height:1px;background:#fff;display: inline-block;"></span>
              <span style="overflow:hidden;height:50%;width:100%;display:flex;align-items:center;justify-content:center;">${getSingleInfo(imgList[1].avatar, imgList[1].nick_name || imgList[1].nickName)}</span>
            </span>
            <span style="height: 100%;width:1px;background:#fff;"></span>
            <span style="overflow:hidden;height:100%;width:50%;display: flex;flex-direction:column;">
              <span style="overflow:hidden;height:50%;width:100%;display:flex;align-items:center;justify-content:center;">${getSingleInfo(imgList[2].avatar, imgList[2].nick_name || imgList[2].nickName)}</span>
              <span style="width: 100%;height:1px;background:#fff;display: inline-block;"></span>
              <span style="overflow:hidden;height:50%;width:100%;display:flex;align-items:center;justify-content:center;">${getSingleInfo(imgList[3].avatar, imgList[3].nick_name || imgList[3].nickName)}</span>
            </span>
          </span>`
          break
      }
      el.innerHTML = showDom
    } else {
      //el.innerHTML = `${NAME}`
      if(collectHook.isCollect(fullId)){
        el.innerHTML = `<div style="width:100%;height:100%;text-align:center;line-height:38px;position:relative">${NAME}</div><img src='${foucsImg}' width="14" height="14" style="position:absolute;bottom:0;right:0">`
      }else{
        el.innerHTML = `${NAME}`
      }
    }
  }
}

export default {
  async mounted (el:any, binding:any, vnode?:any) {
    const { stop } = useIntersectionObserver(
      el,
      // isIntersecting 布尔值，元素可见为 true，元素不可见为 false
      ([{ isIntersecting }], observerElement) => {
        // 图片标签是否可见
        if (isIntersecting) {
          // 如果目标可见，替换图片地址，自动加载图片
          // el.src = binding.value
          avatarDel(el, binding, vnode)
          // 如果图片地址是错误的，无法加载图片，显示占位图(默认图)
          el.onerror = () => {
            // el.src =
            // avatarDel(el, binding, vnode)
          }
          // 主动停止检测元素可见性
          stop()
        }
      },
      // 🔔优化： 0 元素刚进入可视区触发，1 表示元素完整进入可视区才触发
      { threshold: [0] })
    // avatarDel(el, binding, vnode)
  },
  updated (el:any, binding:any, vnode?:any) {
    const flag = !binding.arg || binding.arg + '' === el.oldArg + ''
    if (flag && binding.value === binding.oldValue&&collectHook.isCollect(el.fullId)) {
      return false
    }
    el.oldArg = binding.arg
    avatarDel(el, binding, vnode)
  },
  unmounted (el:any, binding:any, vnode?:any) {
    // console.log(`unbind`)
  }

}

/**
 * 检测图片是否存在   --   不用，性能问题
 * @param url
 */
// let imageIsExist = function (url) {
//   return new Promise(resolve => {
//     var img = new Image()
//     img.onload = function () {
//       if (this.complete === true) {
//         // console.log(`imageIsExist`, img)
//         resolve(true)
//         img = null
//       }
//     }
//     img.onerror = function () {
//       resolve(false)
//       img = null
//     }
//     img.src = url
//   })
// }
