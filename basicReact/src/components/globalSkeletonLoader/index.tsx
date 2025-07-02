import { Spin } from 'antd'

const GlobalSkeletonLoader = () => {
  return (
    <div className="global-skeleton-loader">
      <Spin size="large" tip="加载中..." />
      {/* 这里可以添加更复杂的骨架屏UI */}
    </div>
  )
}

export default GlobalSkeletonLoader
