'use strict'
import http from './http'
import { API as configApi } from '@/conf/'
// 获取接口根路径
const isProd = import.meta.env.MODE === 'production'
const BASE_PATH = isProd ? configApi.production : configApi.development

export default {
  request: async (options, _callback) => {
    try {
      let data = JSON.stringify(options.data)
      if (options.mask) {
        data.mask = {
          background: 'rgba(255,255,255,0.25)'
        }
      } else {
        data.mask = false
      }
      const apiType = options.apiType || 'DEFAULT' // 未指定apiType则默认为 'DEFAULT'
      options.apiType = apiType
      data.url = `${BASE_PATH[apiType]}${options.url || ''}`
      return httpRequest(data.url, {
        method: options.method || 'post',
        data: data['data'],
        params: options['params'],
        json: options['json'],
        headers: {
          'Content-Type': data['contentType'] || 'application/json'
        },
        mask: data.mask,
        callback: _callback
      }).then((res) => {
        // 暂不做统一格式化处理
        let result = res
        if (+result.code === 10069) { // 重写会话过期逻辑
          // 此处可调退出登录逻辑
        } else {
          if (+result.code !== 0) { // 后台报错后在前端抛出
            $message(result.msg || 'error')
          }
          return Promise.resolve(result)
        }
      }).catch(err => {
        return Promise.reject(err)
      })
    } catch (err) {
      console.error(err)
    }
  },
  config: BASE_PATH // 配置信息
}

class OriginHttp {
  constructor(_url, _options) {
    this.options = Object.assign(
      {
        mask: true,
        method: 'get'
      },
      this._setOptions(_url, _options)
    )
  }

  request (resolve, reject) {
    const options = this.options
    const CALLBACK = options.callback
    http(options).then(response => {
      // 无论咋样
      CALLBACK[2] && CALLBACK[2](response.data, response)
      resolve(response)
    }).catch(err => {
      // 捕捉异常
      CALLBACK[3] && CALLBACK[3](err)
      reject(err)
    })
  }

  _setOptions (_url, _options) {
    let options = _options
    options.url = _url
    if (typeof _options.callback === 'function') {
      options.callback = [null, null, _options.callback]
    } else if (!_options.callback) {
      options.callback = []
    }
    return options
  }
}

const httpRequest = (url, options) => {
  return new Promise((resolve, reject) => {
    const baseRequest = new OriginHttp(url, options)
    baseRequest.request(resolve, reject)
  })
}
