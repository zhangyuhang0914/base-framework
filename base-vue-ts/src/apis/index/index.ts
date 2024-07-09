'use strict'
import { API as configApi } from '@/conf/index'
import Request from '@/common/http/http'
import type { httpRequestConfig, ApiResponse } from '@/common/http/types'
import type { DictListItem } from './types'

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
  return Request.get(param) as Promise<ApiResponse<DictListItem[]>>
}

/**
 * @desc: 测试
 * @return {*}
 */
export const carouselImgList = (params: AnyObject = {}): Promise<ApiResponse<any[]>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    loading: true,
    url: '/api/fin/carousel/list',
    params: params
  }
  return Request.get(param) as Promise<ApiResponse<any[]>>
}
