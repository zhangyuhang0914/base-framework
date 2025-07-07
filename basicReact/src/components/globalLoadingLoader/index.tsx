import { Spin } from 'antd'
import styled from 'styled-components'

const StyledGlobalLoadingLoader = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const GlobalLoadingLoader = () => {
  return (
    <StyledGlobalLoadingLoader className="globalLoadingLoader">
      <Spin size="large" tip="加载中..." />
    </StyledGlobalLoadingLoader>
  )
}

export default GlobalLoadingLoader
