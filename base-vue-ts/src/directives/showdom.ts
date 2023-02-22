// 懒加载

import { useIntersectionObserver } from '@vueuse/core'
export default {
  async mounted (el:any, binding:any, vnode?:any) {
    // stop 是一个函数，用于停止检测元素可见性
    const { stop } = useIntersectionObserver(
      el,
      // isIntersecting 布尔值，元素可见为 true，元素不可见为 false
      ([{ isIntersecting }], observerElement) => {
        // 是否可见
        if (isIntersecting) {
          // 如果目标可见，替换图片地址，自动加载图片
          // el.src = binding.value
          const id = el.getAttribute('data-id')
          console.log('显示了', id)
          el.click(id)
          // 主动停止检测元素可见性
          stop()
        }
      },
      // 🔔优化： 0 元素刚进入可视区触发，1 表示元素完整进入可视区才触发
      { threshold: [0] })
  }

}
