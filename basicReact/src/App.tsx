import React from 'react'
import '@assets/css/app.scss'
import LayoutHeader from '@/pages/layout/header'
import LayoutContainer from '@/pages/layout/container'
import LayoutFooter from '@/pages/layout/footer/index'
import styled from 'styled-components'

const StyledAppPage = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const App: React.FC = () => {
  return (
    <StyledAppPage className="App">
      <LayoutHeader></LayoutHeader>
      <LayoutContainer></LayoutContainer>
      <LayoutFooter></LayoutFooter>
    </StyledAppPage>
  )
}

export default App
