'use strict'
import { API as configApi } from '@/conf/'
import qs from 'querystring'
import { getStorage, removeStorage } from '@/utils/storage'
import { linkJump } from '@/common/common'

// 获取接口根路径
const isProd = import.meta.env.MODE === 'production'
const BASE_PATH = isProd ? configApi.production : configApi.development

export const request = (options) => {
  return new Promise((resolve, reject) => {
    let url = options.url

    // 简化类型设置
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cookie': `JSESSIONID=${getStorage('JSESSIONID') || ''}`
    }
    // 提交表单类型
    if (options.isForm) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      delete options.isForm
    }
    // 提交上传类型
    if (options.isFile) {
      headers['Content-Type'] = 'multipart/form-data; charset=UTF-8'
      delete options.isFile
    }
    // 校验post数据格式
    const contentTyoe = headers['Content-Type']
    if (
      typeof options.params === 'object' &&
      contentTyoe &&
      String(contentTyoe).indexOf('application/x-www-form-urlencoded') > -1
    ) {
      options.params = qs.stringify(options.params)
    }
    // 设置请求路径
    options.url = BASE_PATH[options.apiType || 'JR'] + url

    console.log('url', options, options.params)
    uni.request({
      url: options.url,
      method: options.method,
      data: options.params,
      withCredentials: true,
      header: {
        'Content-Type': headers['Content-Type'],
        'Cookie': headers['Cookie'],
        'responseJson': 'YES'
      },
      success (response) {
        console.log('success', response)
        const status = +response.statusCode
        const data = response.data || {}
        if (status === 200 || status === 304) {
          if (data.id === 500) {
            removeStorage('JSESSIONID', '')
            linkJump('/pages/login/index')
          } else if (data.id === '01') {
            resolve(data)
          } else {
            uni.$u.toast(data.msg || '')
            reject(data)
          }
        } else if (status === 404) {
          linkJump('/pages/404/index')
          reject(data)
        } else {
          reject(data)
        }
      },
      fail (error) {
        reject(error)
      }
    })
  })
}
