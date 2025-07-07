import React from 'react'
import { Button } from 'antd'
import styled from 'styled-components'

const StyledLayoutFooter = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
`

const LayoutFooter: React.FC = () => {
  return (
    <StyledLayoutFooter className="layoutFooter">
      <Button type="primary">我是底部</Button>
    </StyledLayoutFooter>
  )
}

export default LayoutFooter
