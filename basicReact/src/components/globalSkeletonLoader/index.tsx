import { Spin } from 'antd'
import styled from 'styled-components'

const StyledGlobalSkeletonLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const GlobalSkeletonLoader = () => {
  return (
    <StyledGlobalSkeletonLoader className="globalSkeletonLoader">
      <Spin size="large" tip="加载中..." />
    </StyledGlobalSkeletonLoader>
  )
}

export default GlobalSkeletonLoader
