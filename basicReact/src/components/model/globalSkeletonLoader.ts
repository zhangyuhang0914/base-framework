import type { ReactNode } from 'react'

// 组件接口
export interface GlobalSkeletonLoaderProps {
  loading?: boolean
  autoLoad?: boolean
  loadDelay?: number
  children: ReactNode // 接受任意React节点
}
