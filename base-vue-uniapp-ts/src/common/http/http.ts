'use strict'
import { API as configApi } from '@/conf/index'
import type { ApiResponse, httpRequestConfig, UniApiResponse } from './types'
import { getStorage } from '@/util/storage'
import { userCommonStoreHook } from '@/store/modules/common'
import { loading } from '@/common/uni-utils'

// 获取接口根路径
const isProd = import.meta.env.MODE === 'production'
const BASE_PATH: AnyObject = isProd ? configApi.production : configApi.development

class Request {
  private static instance: any = new Request({ url: '' })
  public static getInstance(): Request {
    return Request.instance
  }
  // 基础配置
  private baseConfig: UniApp.RequestOptions = {
    url: BASE_PATH['BASE_URL'],
    header: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json; charset=UTF-8'
    },
    timeout: 1000 * 30 // 设置超时时间
  }
  constructor(options: httpRequestConfig) {
    this.baseConfig = Object.assign({}, this.baseConfig, options)
  }

  // 请求拦截器
  interceptorRequest(options: httpRequestConfig): httpRequestConfig {
    let header = JSON.parse(JSON.stringify(options.header))
    // 提交表单类型
    if (options.isForm) {
      header['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      delete options.isForm
    }
    // 提交上传类型
    if (options.formUpload) {
      header['Content-Type'] = 'multipart/form-data; charset=UTF-8'
      delete options.formUpload
    }
    // 添加 Cookie
    if (getStorage('JSESSIONID')) {
      header['Cookie'] = `JSESSIONID=${getStorage('JSESSIONID') || ''}`
    }
    // 添加 token
    if (userCommonStoreHook().token) {
      header['token'] = userCommonStoreHook().token
    } else {
      header['token'] && delete header['token']
    }
    // 设置请求路径
    if (!options.url.startsWith('http') && !options.url.startsWith('https')) {
      options.url = BASE_PATH[options.apiType || 'BASE_URL'] + options.url
    }
    options.header = header
    return options
  }

  // 请求
  public request<T>(options: httpRequestConfig): Promise<ApiResponse<T>> {
    // 拦截 request 请求
    options = this.interceptorRequest(Object.assign({}, this.baseConfig, options))
    // uni.addInterceptor('request', this.invoke(this.baseConfig))
    return new Promise((resolve, reject) => {
      // 设置loading效果
      if (options.loading) {
        loading.show()
        delete options.loading
      }
      uni.request({
        url: options.url,
        method: options.method,
        data: options.params,
        withCredentials: true,
        header: options.header,
        success(response: UniApiResponse) {
          loading.hide()
          const status = +response.statusCode
          const data = response.data || {}
          if (status === 200) {
            if (data.code === 0 || data.Ret_RstInf_Dsc === '查询成功') {
              resolve(data)
            } else if (data.code === 500 || data.msg === 'token不能为空') {
              // 退出登录
              userCommonStoreHook().logout(false, '登录已失效，请重新登录')
            } else {
              if (!options.noShowMsg) {
                setTimeout(() => {
                  if (data.msg && typeof data.msg === 'string') {
                    Request.getInstance().showMessage(data.msg)
                  } else if (data.bz && typeof data.bz === 'string') {
                    Request.getInstance().showMessage(data.bz)
                  } else {
                    Request.getInstance().showMessage(data.msg || data.bz || '')
                  }
                }, 0)
              }
              reject(data)
            }
          } else if (status === 404) {
            uni.$u.toast('404 Not Found')
            reject(data)
          } else {
            uni.$u.toast('404 Not Found')
            reject(data)
          }
        },
        fail(error: UniApp.GeneralCallbackResult) {
          loading.hide()
          if (error.errMsg === 'request:fail timeout') {
            uni.$u.toast('请求超时，请重试')
          } else if (error.errMsg === 'request:fail ') {
            uni.$u.toast('无网络')
          } else {
            console.error(error.errMsg || '无url', '请求接口超过一分钟无响应')
            uni.$u.toast('服务器繁忙' || error.errMsg)
          }
          reject(error)
        }
      })
    })
  }

  // 附件上传
  public requestUpload<T>(options: httpRequestConfig): Promise<T> {
    // 拦截 uploadFile 文件上传
    options = this.interceptorRequest(Object.assign({}, this.baseConfig, options))
    // uni.addInterceptor('uploadFile', this.invoke(this.baseConfig))
    return new Promise((resolve, reject) => {
      // 设置loading效果
      if (options.loading) {
        loading.show()
        delete options.loading
      }
      uni.uploadFile({
        url: options.url,
        filePath: options.filePath,
        name: 'file',
        formData: options.params,
        header: options.header,
        success(request: UniApiResponse) {
          loading.hide()
          if (request.statusCode === 200) {
            if (request.data.code == '500') {
              userCommonStoreHook().logout(false, '登录已失效，请重新登录')
            } else {
              resolve(JSON.parse(request.data))
            }
          } else if (request.statusCode === 302) {
            // 退出登录
            userCommonStoreHook().logout()
          } else {
            reject(request.data)
          }
        },
        fail(error: UniApp.GeneralCallbackResult) {
          loading.hide()
          uni.$u.toast(error.errMsg || '网络连接错误，请刷新或稍后重试！')
        }
      })
    })
  }

  // 提示弹窗
  public showMessage(content: string, title: string = '提示') {
    if (content.length > 25) {
      uni.showModal({
        title: title,
        content: content,
        showCancel: false
      })
    } else {
      uni.$u.toast(content)
    }
  }
}

export default Request.getInstance()
