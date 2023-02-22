'use strict'
import axios from 'axios'
import { API as configApi } from '@/conf/index'
import qs from 'querystring'
import { getToken } from '@/utils/cookie'
import CryptoJS from '@/utils/aes.js'

// 获取接口跟路径
const isProd = import.meta.env.MODE === 'production'
const BASE_PATH = isProd ? configApi.production : configApi.development


const instance = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=UTF-8'
  },
  timeout: 1000 * 60 // 设置超时时间为 1分钟
})

// 请求拦截器
instance.interceptors.request.use((options) => {
  let url = options.url

  // 简化类型设置
  const headers = options.headers || {}

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
  // 是否加密
  if (options.isEncry) {
    options.data = CryptoJS.AesEncrypt(JSON.stringify(options.data))
    options['pick'] = CryptoJS.SHA1(options.data)
    delete options.isEncry
  } else {
    // 校验post数据格式
    const contentTyoe = headers['Content-Type']
    if (
      typeof options.data === 'object' &&
      contentTyoe &&
      String(contentTyoe).indexOf('application/x-www-form-urlencoded') > -1
    ) {
      options.data = qs.stringify(options.data)
    }
  }

  // 是否设置token
  if (getToken()) {
    headers['Cookie'] = getToken() || ''
  }

  // 设置请求路径
  options.url = BASE_PATH[options.apiType || 'DEFAULT'] + url

  return options
}, (error) => {
  // 请求错误
  return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use(async (response) => {
  console.log('响应拦截器', response)
  return response
}, (error) => {
  // 响应错误
  if (error.response) {
    const data = error.response.data
    const status = error.response.status
    console.error(error.config.url, status, JSON.stringify(data))
    let errMessage =
      data.message || '服务忙，请稍后重试(error)'
    switch (status) {
      case 401:
        uni.navigateTo({
          path: '../pages/login/index'
        })
        break
      case 404:
        errMessage = '404 Not Found'
        break
      case 500:
        errMessage = '服务器繁忙，请稍后再试'
        break
    }
    // 禁用全局错误提示
    if (error.config.toast !== false) {
      $message(errMessage)
    }
  } else {
    if (axios.isCancel(error)) {
      console.error('请求被取消', error.message)
    } else {
      // 默认放一个空对象避免其他地方报错
      error.response = {}
      console.error((error.config && error.config.url) || '无url', '请求接口超过一分钟无响应')
      $message('您与服务器的连接已经断开，请联系管理员处理')
    }
  }
  return Promise.reject(error)
})

export default instance
