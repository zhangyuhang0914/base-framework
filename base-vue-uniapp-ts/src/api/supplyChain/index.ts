'use strict'
import Request from '@/common/http/http'
import type { httpRequestConfig } from '@/common/http/types'
import type { IProductInfo } from './type'

/**
 *  @desc 获取产品详情
 *  @productDetailId 产品id
 */
export const finProductInfo = (productDetailId: string) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: true,
    url: `/api/fin/product/info/info/${productDetailId}`
  }
  return Request.request<IProductInfo>(param)
}
