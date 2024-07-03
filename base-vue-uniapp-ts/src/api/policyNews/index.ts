'use strict'
import Request from '@/common/http/http'
import type { httpRequestConfig, ApiResponse } from '@/common/http/types'
import type { CountryListItem } from '@/api/policyNews/type'

/**
 * 政策新闻列表
 */
export const queryPublishListByType = (params: AnyObject): Promise<ApiResponse<CountryListItem[]>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: false,
    url: '/api/fin/cmsInfo/queryPublishListByType',
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<CountryListItem[]>>
}

/**
 * 政策新闻详情
 */
export const cmsInfo = (params: AnyObject, id: string) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: false,
    url: `/api/fin/cmsInfo/info/${id}`,
    params: params
  }
  return Request.request(param)
}

/**
 * 平台资讯
 */
export const platformConsultationUrl = (params: AnyObject) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: false,
    url: '/api/I02028/ERT',
    params: params
  }
  return Request.request(param)
}
