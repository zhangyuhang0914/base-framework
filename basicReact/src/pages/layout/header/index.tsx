import React from 'react'
import { Button } from 'antd'
import styled from 'styled-components'
import ThemePicker from '@/components/themePicker'

interface HeaderProps {
  className?: string
}

const StyledLayoutHeader = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`

const LayoutHeader: React.FC<HeaderProps> = () => {
  return (
    <StyledLayoutHeader className="layoutHeader">
      <HeaderLeft>
        <Button type="primary">我是头部</Button>
      </HeaderLeft>
      <HeaderRight>
        <ThemePicker />
      </HeaderRight>
    </StyledLayoutHeader>
  )
}

export default LayoutHeader
