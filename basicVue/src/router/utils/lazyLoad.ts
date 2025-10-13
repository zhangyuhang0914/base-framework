import type { Component } from '@/router/interface'

/**
 * 懒加载组件工具函数
 * 在 Vue 中，我们直接返回动态导入的组件
 */
const LazyLoad = (comp: () => Promise<{ default: Component }>): Component => {
  return comp
}

export default LazyLoad
