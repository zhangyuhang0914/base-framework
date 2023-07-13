import axios from 'axios'
import router from '@/routers'
import { BASE_CONFIG } from '@/conf/index'
import myEncrypt from '@/utils/my-encrypt.js'
import { SHA1 } from '@/utils/utils.js'
import qs from 'qs'
import { $message } from '@/plugins/element'
import { Store } from '@/commons/store'

let BASE_URL = ''
Store.getItem('base_url').then((result) => {
  BASE_URL = result ? `http://${result}` : ''
})
// 申请一个新的http实例
const instance = axios.create({
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 30 * 1000 // 设置超时时间
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    let url = config.url || ''
    // 表单提交
    const method = config.method.toUpperCase()
    if (method === 'POST' && config.isForm) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.data = qs.stringify(config.data)
      delete config['isForm']
    }
    // 设置加密
    if (config.secure === 'YES') {
      config.data = JSON.stringify(config.data)
      if (!(typeof config.data === 'string')) {
        console.error('不是标准json字符串，无法进行安全传输')
        return
      }
      let data = myEncrypt(config.data)
      config.data = data
      config.headers['Content-Type'] = 'application/json'
      config.headers['responseJson'] = 'YES'
      config.headers['secure'] = 'YES'
      config.headers['pick'] = SHA1(data)
    }
    // 添加请求前缀
    config.url = BASE_URL + BASE_CONFIG[config.apiType || 'defaultAjaxPath'] + url
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    try {
      // 响应头信息
      let data = response.data
      let status = response.status
      if (data) {
        if (status === 200 || status === 304) {
          if (data.code === 500) {
            // token失效，清空用户名信息
            // router.app.$router.push({path: '/'})
            return Promise.reject(response)
          } else if (data.code === 0) {
            // 成功
            return response
          } else {
            $message(data.msg, 'error')
            return Promise.reject(response)
          }
        } else {
          $message(data.msg, 'error')
          return Promise.reject(response)
        }
      }
    } catch (e) {
      console.error('返回数据格式错误，请检查！')
      return Promise.reject(response.data ? response.data : response)
    }
  },
  error => {
    if (error.response) {
      const data = error.response.data
      const status = error.response.status
      console.error(error.config.url, status, JSON.stringify(data))
      let errMessage = data.msg || data.message || '服务忙，请稍后重试(error)'
      switch (status) {
        case 401:
          router.replace({
            path: '/login'
          })
          break
        case 404:
          errMessage = '404 Not Found'
          break
        case 500: {
          const code = +data.code || ''
          switch (code) {
            case 1003:
              // 没有登录
              errMessage = '没有登录'
              break
            default:
              errMessage = data.msg || '服务忙，请稍后重试(500)'
              break
          }
          break
        }
      }
    } else {
      if (axios.isCancel(error)) {
        console.error('请求被取消', error.msg)
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
            : '网络已断开连接', 'error'
        )
      }
    }
    return error
  }
)

/**
 * 跳转到404
 */
function forwardNotFound () {
  router.push({ name: '404' })
}

export default instance
