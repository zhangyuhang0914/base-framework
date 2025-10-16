/*
 * 用户相关
 */

import { get, type httpRequestConfig } from '@/common/http/index'

/**
 * 查询数据统计
 */
export const countDisplay = () => {
  return new Promise((resolve, reject) => {
    // alova请求，后期切换成鄂汇办SDK请求。
    const param: httpRequestConfig = {
      url: '/api/fin/loan/countDisplay',
      cacheFor: {
        mode: 'memory',
        expire: 0
      }
    }
    get(param)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
    // 鄂汇办SDK请求
    // ehbAppJssdk.network.request({
    //   url: 'https://prod-gateway.ehbapp.hubei.gov.cn/ded62a5440c141b2aab53399d9475394',
    //   method: 'post',
    //   data: param,
    //   headers: {
    //     'X-hbzw-Api-Key': '70e34b3b-bafe-4987-a268-a427052de696'
    //   },
    //   success: function (result) {
    //     resolve(result)
    //   },
    //   fail: function (err) {
    //     reject(err)
    //   }
    // })
  })
}
