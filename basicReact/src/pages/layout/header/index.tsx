import React from 'react'
import { Button } from 'antd'
import styled from 'styled-components'

interface HeaderProps {
  className?: string
}

const StyledLayoutHeader = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
`

const LayoutHeader: React.FC<HeaderProps> = () => {
  return (
    <StyledLayoutHeader className="layoutHeader">
      <Button type="primary">我是头部</Button>
    </StyledLayoutHeader>
  )
}

export default LayoutHeader
