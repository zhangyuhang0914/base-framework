'use strict'
import axios from 'axios'
import { removeToken } from '@/utils/cookie'
import { linkJump } from '@/common/common'
import { $notify } from '@/plugins/uview'

// 获取接口跟路径
module.exports = () => {
  // 请求拦截器
  uni.$u.http.interceptors.request.use((options) => {
    console.log('options', options)
    return options
  }, (error) => {
    // 请求错误
    return Promise.reject(error)
  })

  // 响应拦截器
  uni.$u.http.interceptors.response.use(async (response) => {
    console.log('响应拦截器', response)
    return response
  }, (error) => {
    console.log('响应错误', error)
    // 响应错误
    if (error.response) {
      const data = error.response.data
      const status = error.response.status
      console.error(error.config.url, status, JSON.stringify(data))
      let errMessage =
        data.message || '服务忙，请稍后重试(error)'
      switch (status) {
        case 401:
          removeToken()
          linkJump('pages/login/index')
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
        removeToken()
        linkJump('pages/login/index')
        $notify(errMessage)
      }
    } else {
      if (axios.isCancel(error)) {
        console.error('请求被取消', error.message)
      } else {
        // 默认放一个空对象避免其他地方报错
        error.response = {}
        console.error((error.config && error.config.url) || '无url', '请求接口超过一分钟无响应')
        $notify('您与服务器的连接已经断开，请联系管理员处理')
      }
    }
    return Promise.reject(error)
  })
}
