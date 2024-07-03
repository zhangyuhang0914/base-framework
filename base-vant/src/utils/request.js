import axios from 'axios'
import router from '../routers'
import { userCommonStoreHook } from '@/stores/modules/common'
import {BASE_CONFIG} from '../conf/index'

axios.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.timeout = 30 * 1000 // 设置超时时间

// 请求拦截器
axios.interceptors.request.use(config => {
  // 设置token值
  let token = userCommonStoreHook().token
  if (token) config.headers['token'] = token
  // 添加请求前缀
  let ajaxPath = BASE_CONFIG[config.apiType || 'defaultAjaxPath']
  let url = config.url
  if (ajaxPath && !url.startsWith('http') && !url.startsWith('https')) {
    config.url = ajaxPath + url
  }
  return config
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use(response => {
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
          return Promise.reject(response)
        }
      } else {
        return Promise.reject(response)
      }
    }
  } catch (e) {
    console.error('返回数据格式错误，请检查！')
    return Promise.reject(response)
  }
}, error => {
  return Promise.reject(error.response)
})

/**
 * 跳转到404
 */
function forwardNotFound () {
  router.push({name: '404'})
}
export default axios
