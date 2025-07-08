import React from 'react'
import '@assets/css/app.scss'
import LayoutHeader from '@/pages/layout/header'
import LayoutFooter from '@/pages/layout/footer/index'
import styled from 'styled-components'
import AuthRouter from '@/router/utils/authRouter'
import { Outlet } from 'react-router-dom'

const StyledAppPage = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const StyledContainer = styled.div`
  position: relative;
  flex: 1;
`

const Layout: React.FC = () => {
  return (
    <StyledAppPage className="App">
      <LayoutHeader></LayoutHeader>
      <StyledContainer className="layoutContainer">
        {/* 路由权限控制层，子路由通过 Outlet 渲染 */}
        <AuthRouter>
          <Outlet />
        </AuthRouter>
      </StyledContainer>
      <LayoutFooter></LayoutFooter>
    </StyledAppPage>
  )
}

export default Layout
