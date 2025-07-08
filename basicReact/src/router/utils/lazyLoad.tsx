import GlobalLoadingLoader from '@/components/globalLoadingLoader'
import type React from 'react'
import { Suspense } from 'react'

const LazyLoad = (Comp: React.LazyExoticComponent<any>): React.ReactNode => {
  return (
    <Suspense fallback={<GlobalLoadingLoader />}>
      <Comp />
    </Suspense>
  )
}

export default LazyLoad
