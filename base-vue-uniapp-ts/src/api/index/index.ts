'use strict'
import { API as configApi } from '@/conf/index'
import Request from '@/common/http/http'
import type { httpRequestConfig, ApiResponse } from '@/common/http/types'
import type { CarouselImgItem, DictListItem, InstitutionsByIdListParam, InstitutionsListItem } from './types'
import type { BankListItem, ProductListItem } from '@/api/financeProduct/types'

// 获取接口根路径
const isProd = import.meta.env.MODE === 'production'
const BASE_PATH = isProd ? configApi.production : configApi.development

/**
 * @desc: 文件下载预览
 * @return {*}
 */
export const fileDownload = (id: string) => {
  return `${BASE_PATH['BASE_URL']}/api/fileHandle/download?type=file&ids=${id}`
}

/**
 * @desc: 字典
 * @return {*}
 */
export const getDictParamData = (dictType: string): Promise<ApiResponse<DictListItem[]>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: true,
    url: `/api/fin/product/info/treeMap?dicTypeSign=${dictType}`
  }
  return Request.request(param) as Promise<ApiResponse<DictListItem[]>>
}

/**
 * @desc: 首页轮播图
 * @return {*}
 */
export const carouselImgList = (params: AnyObject = {}): Promise<ApiResponse<CarouselImgItem[]>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: true,
    url: '/api/fin/carousel/list',
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<CarouselImgItem[]>>
}

/**
 * @desc: 热门推荐
 * @return {*}
 */
export const carouselProductList = (params: AnyObject = {}): Promise<ApiResponse<ProductListItem[]>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: true,
    url: '/api/fin/product/info/CarouselList',
    params: params
  }
  return Request.request(param)
}

/**
 * @desc: 数据统计
 * @return {*}
 */
export const countDisplay = <T>(params: AnyObject = {}): Promise<ApiResponse<T>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: true,
    url: '/api/fin/loan/countDisplay',
    params: params
  }
  return Request.request(param)
}

/**
 * @desc: 合作机构列表
 * @return {*}
 */
export const institutionsBankList = (params: AnyObject): Promise<ApiResponse<BankListItem[]>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: true,
    url: '/api/web/institutions/bank/list',
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<BankListItem[]>>
}

/**
 * @desc: 合作机构详情
 * @return {*}
 */
export const institutionsBankInfo = (id: string): Promise<ApiResponse<BankListItem>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: true,
    url: `/api/web/institutions/bank/info/${id}`
  }
  return Request.request(param) as Promise<ApiResponse<BankListItem>>
}

/**
 * @desc: 根据机构id查询分支机构
 * @return {*}
 */
export const institutionsByIdList = (params: InstitutionsByIdListParam): Promise<ApiResponse<InstitutionsListItem[]>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: true,
    url: `/api/web/institutions/list?page=${params.page}&limit=${params.limit}&finInstitutionsBankId=${params.finInstitutionsBankId}&cityCode=${params.cityCode}`
  }
  return Request.request(param) as Promise<ApiResponse<InstitutionsListItem[]>>
}
