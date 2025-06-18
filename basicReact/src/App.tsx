import React from 'react'
import '@/assets/css/app.scss'
import LayoutHeader from '@/pages/layout/header/index'
import { Outlet } from 'react-router'
import LayoutFooter from '@/pages/layout/footer/index'

const App: React.FC = () => {
  return (
    <div className={'App'}>
      <LayoutHeader></LayoutHeader>
      <Outlet />
      <LayoutFooter></LayoutFooter>
    </div>
  )
}

export default App
