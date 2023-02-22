// 懒加载

import { useIntersectionObserver } from '@vueuse/core'
const {BASE_URL} = import.meta.env
const defaultImg = `${BASE_URL}images/common/welcome.png`
export default {
  async mounted (el:any, binding:any, vnode?:any) {
    // stop 是一个函数，用于停止检测元素可见性
    const { stop } = useIntersectionObserver(
      el,
      // isIntersecting 布尔值，元素可见为 true，元素不可见为 false
      ([{ isIntersecting }], observerElement) => {
        // 图片标签是否可见
        if (isIntersecting) {
          // 如果目标可见，替换图片地址，自动加载图片
          el.src = binding.value
          // 如果图片地址是错误的，无法加载图片，显示占位图(默认图)
          el.onerror = () => {
            el.src = defaultImg
          }
          // 主动停止检测元素可见性
          stop()
        }
      },
      // 🔔优化： 0 元素刚进入可视区触发，1 表示元素完整进入可视区才触发
      { threshold: [0] })
  }

}
