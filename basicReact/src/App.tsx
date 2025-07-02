import React from 'react'
import '@assets/css/app.scss'
import { Outlet } from 'react-router'
import LayoutHeader from '@/pages/layout/header'
import LayoutFooter from '@/pages/layout/footer/index'
import GlobalSkeletonLoader from '@/components/globalSkeletonLoader'

const App: React.FC = () => {
  return (
    <div className={'App'}>
      <LayoutHeader></LayoutHeader>
      <GlobalSkeletonLoader></GlobalSkeletonLoader>
      {/* 懒加载组件 */}
      <React.Suspense fallback={<GlobalSkeletonLoader />}>
        <Outlet />
      </React.Suspense>
      <LayoutFooter></LayoutFooter>
    </div>
  )
}

export default App
