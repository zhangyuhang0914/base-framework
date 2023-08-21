/*
 * @Desc         : 图片懒加载指令
 * @Autor        : ZhangYuHang
 * @Date         : 2023-08-14 15:00:04
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-08-21 10:55:47
 */
'use strict'
import { useIntersectionObserver } from '@vueuse/core'

export default {
  async mounted(el: any, binding: any, vnode?: any) {
    const { stop } = useIntersectionObserver(
      el,
      // isIntersecting 布尔值，元素可见为 true，元素不可见为 false
      ([{ isIntersecting }], observerElement) => {
        // 图片标签是否可见
        if (isIntersecting) {
          // 如果目标可见，替换图片地址，自动加载图片
          el.src = binding.value
          // 如果图片地址是错误的，无法加载图片，(可选择显示占位图)
          el.onerror = () => {
            el.src = ''
          }
          // 主动停止检测元素可见性
          stop()
        }
      },
      // 🔔优化： 0 元素刚进入可视区触发，1 表示元素完整进入可视区才触发
      { threshold: [0] }
    )
  }
}
