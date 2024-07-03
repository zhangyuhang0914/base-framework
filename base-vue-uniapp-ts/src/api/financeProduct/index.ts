'use strict'
import Request from '@/common/http/http'
import type { httpRequestConfig, ApiResponse } from '@/common/http/types'
import type { CollectionParamsType, ProductListItem, BankListItem, AreaInListItem } from './types'
import { userCommonStoreHook } from '@/store/modules/common'

/**
 * @desc: 添加收藏/取消收藏
 * @return {*}
 */
export const collectionSave = <T>(params: CollectionParamsType): Promise<ApiResponse<T>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/web/collection/saveOrDel',
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<T>>
}

/**
 * @desc: 查询收藏状态
 * @return {*}
 */
export const collectionWhetherCollection = <T>(params: CollectionParamsType): Promise<ApiResponse<T>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/web/collection/whetherCollection',
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<T>>
}

/**
 * @desc: 产品列表
 * @return {*}
 */
export const productInfoList = (params: AnyObject): Promise<ApiResponse<ProductListItem[]>> => {
  const commonStoreHook = userCommonStoreHook()
  let url = '/api/fin/product/info/list' // 未登录产品列表
  if (commonStoreHook.token) {
    url = '/api/fin/product/info/isLoginList' // 已登录产品列表
  }
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: true,
    url: url,
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<ProductListItem[]>>
}

/**
 * @desc: 全部银行
 * @return {*}
 */
export const bankFindAll = (params: AnyObject): Promise<ApiResponse<BankListItem[]>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: true,
    url: '/api/web/institutions/bank/findAll',
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<BankListItem[]>>
}

/**
 * @desc: 所在区域
 * @return {*}
 */
export const areaInList = (params: AnyObject): Promise<ApiResponse<AreaInListItem[]>> => {
  params['pid'] = '322488289fe74381974cda7cad5086d4'
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: true,
    url: '/api/web/area/list',
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<AreaInListItem[]>>
}

/**
 * @desc: 产品详情
 * @return {*}
 */
export const productInfo = (id: string): Promise<ApiResponse<ProductListItem>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: true,
    url: `/api/fin/product/info/info/${id}`
  }
  return Request.request(param) as Promise<ApiResponse<ProductListItem>>
}

/**
 * @desc: 产品申请
 * @return {*}
 */
export const productSaveCredit = (params: AnyObject): Promise<ApiResponse<AnyObject>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/financial/loan/inquiryinfo/saveCredit',
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<AnyObject>>
}
