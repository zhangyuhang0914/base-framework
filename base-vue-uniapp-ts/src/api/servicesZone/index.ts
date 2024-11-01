'use strict'
import Request from '@/common/http/http'
import type { ApiResponse, httpRequestConfig } from '@/common/http/types'
import type { ITechnologyFinanceItem, SpecialZoneItem } from './type'

/**
 *  获取政策文件
 */
export const technologyFinanceList = (params: AnyObject) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: true,
    url: '/api/web/wcmZcfg/technologyFinanceList',
    params: params
  }
  return Request.request<ITechnologyFinanceItem[]>(param)
}

/**
 *  区域股权市场服务与产品申请提交
 */
export const reportSaveData = (params: AnyObject) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/fin/report/saveData',
    params: params
  }
  return Request.request(param)
}

/**
 *  政策文件查看详情
 */
export const technologyFinance = (financeId: string) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: true,
    url: `/api/web/wcmZcfg/technologyFinance/${financeId}`
  }
  return Request.request<ITechnologyFinanceItem>(param)
}

/**
 *  查询服务专区列表
 */
export const specialZoneList = (params: AnyObject = {}): Promise<ApiResponse<SpecialZoneItem[]>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: true,
    url: '/api/fin/special/zone/list',
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<SpecialZoneItem[]>>
}
