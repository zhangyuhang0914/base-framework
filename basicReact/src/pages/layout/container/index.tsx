import GlobalLoadingLoader from '@/components/globalLoadingLoader'
import React from 'react'
import { Outlet } from 'react-router'
import styled from 'styled-components'

const StyledContainer = styled.div`
  flex: 1;
`
const OutletContainer = styled.div`
  width: 100%;
  height: 100%;
`

const LayoutContainer: React.FC = () => {
  return (
    <StyledContainer className="layoutContainer">
      <React.Suspense fallback={<GlobalLoadingLoader />}>
        <OutletContainer className="outletContainer">
          <Outlet />
        </OutletContainer>
      </React.Suspense>
    </StyledContainer>
  )
}

export default LayoutContainer
