/*
 * @Desc         : 图片懒加载指令
 * @Autor        : ZhangYuHang
 * @Date         : 2023-08-14 15:00:04
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-08-14 17:55:52
 */
'use strict'
import { useIntersectionObserver } from '@vueuse/core'
const avatarLoad = (el: any, binding: any, vnode?: any) => {
  let imgURL = binding.value // 获取图片地址
  el.innerHTML = `<img src="${imgURL}" width="100%" height="100%" style="border-radius:50%;position:relative">`
}

export default {
  async mounted(el: any, binding: any, vnode?: any) {
    const { stop } = useIntersectionObserver(
      el,
      // isIntersecting 布尔值，元素可见为 true，元素不可见为 false
      ([{ isIntersecting }], observerElement) => {
        // 图片标签是否可见
        if (isIntersecting) {
          // 如果目标可见，替换图片地址，自动加载图片
          // el.src = binding.value
          avatarLoad(el, binding, vnode)
          // 如果图片地址是错误的，无法加载图片，显示占位图(默认图)
          // el.onerror = () => {
          //   el.src = ''
          // }
          stop()
        }
      },
      // 🔔优化： 0 元素刚进入可视区触发，1 表示元素完整进入可视区才触发
      { threshold: [0] }
    )
  },
  updated(el: any, binding: any, vnode?: any) {
    const arg = binding.arg || '' // 传入指令参数名称
    const oldArg = el.oldArg || '' // 保存前一次指令执行时的参数名称
    console.log('updated', el, binding, vnode, arg, oldArg)
  }
}
