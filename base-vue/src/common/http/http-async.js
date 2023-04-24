'use strict'
/**
 * @Desc         :
 * @Autor        : ZYH
 * @Date         : 2023-04-23 17:01:20
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-04-24 15:55:20
 */

import axios from 'axios'
import qs from 'querystring'
import { API as configApi } from '@/conf/index'
import { getJsessionId } from '@/utils/cookies'
import { storageLocal } from '@/utils/storage'
import { userCommonStoreHook } from '@/store/modules/common'
import { useRouter } from 'vue-router'
import { $message } from '@/plugins/element'

const router = useRouter()
// 获取接口跟路径
const isProd = import.meta.env.MODE === 'production'
const BASE_PATH = isProd ? configApi.production : configApi.development

// 申请一个新的http实例
const instance = axios.create({
  // baseURL: 再配,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=UTF-8'
  },
  timeout: 1000 * 60 // 设置超时时间为1分钟
})
// 添加请求拦截器
instance.interceptors.request.use(
  options => {
    let url = options.url
    // 简化类型设置
    const headers = options.headers || {}
    // 提交表单类型
    if (options.isForm) {
      headers['Content-Type'] =
        'application/x-www-form-urlencoded; charset=UTF-8'
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
    // 是否需要配置token
    if (getJsessionId()) {
      headers['Cookie'] = getJsessionId() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // 添加token
    if (userCommonStoreHook().token) {
      headers['token'] = userCommonStoreHook().token
    }
    // 设置请求路径
    options.url = BASE_PATH[options.apiType || 'JR'] + url

    console.log('url', options, options.params)
    if (options.cancelFn) {
      console.log('url1', options, options.params, options.cancelFn)
      options.cancelToken = new cancelToken(function executor (c) {
        options.cancelFn && options.cancelFn(c)
      })
    }
    return options
  },
  error => {
    return Promise.reject(error)
  }
)
// 添加请求拦截器
instance.interceptors.response.use(
  response => {
    if (response.headers && response.headers['Set-Cookie']) {
      let setCookie = response.headers['Set-Cookie']
      let local = setCookie.slice(0, setCookie.indexOf(';'))
      let localId = local.slice(local.indexOf('=') + 1)
      storageLocal.setItem('JSESSIONID', localId)
    }
    return response
  },
  error => {
    if (error.response) {
      const data = error.response.data
      const status = error.response.status
      console.error(error.config.url, status, JSON.stringify(data))
      let errMessage = data.message || '服务忙，请稍后重试(error)'
      switch (status) {
        case 401:
          router.replace({
            path: '/login'
          })
          break
        case 404:
          errMessage = data.message || '404 Not Found'
          break
        case 500:
          switch (+data.code) {
            case 1003:
              // 没有登录
              errMessage = '没有登录'
              break
            default:
              errMessage = data.message || data.msg || '服务忙，请稍后重试(500)'
              if (!isProd) {
                errMessage = `${errMessage} - 状态码：${+data.code || status}`
              }
              break
          }
          break
        default:
          $message(errMessage)
          break
      }
      // 禁用全局错误提示
      if (error.config.toast !== false) {
        $message(errMessage)
      }
    } else {
      if (axios.isCancel(error)) {
        console.error('请求被取消', error.message)
        return Promise.reject(error)
      } else {
        // 默认放一个空对象避免其他地方报错
        error.response = {}
        console.error(
          (error.config && error.config.url) || '无url',
          '请求接口超过一分钟无响应'
        )
        $message(
          navigator.onLine
            ? '您与服务器的连接已经断开，请联系管理员处理'
            : '网络已断开连接'
        )
      }
    }
    return error
  }
)

export default instance

export const cancelToken = axios.CancelToken
