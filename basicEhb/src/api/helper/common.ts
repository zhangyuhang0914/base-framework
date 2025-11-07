import type { Base64AreaCodeParams, Base64AreaCodeResponse, DictItem } from '@/api/interface/common'
import { get, type ApiResponse, type httpRequestConfig } from '@/common/http/index'

// 字典数据
export const getDictionaryData = (dictName: string): Promise<ApiResponse<DictItem[]>> => {
  const param: httpRequestConfig = {
    url: `/api/dictionary/findByClass?value=${dictName}`,
    cacheFor: {
      mode: 'memory',
      expire: 0
    }
  }
  return get(param)
}

// 通过base64查询事项、部门及区划
export const getBase64AreaCode = (
  params: Base64AreaCodeParams
): Promise<Base64AreaCodeResponse> => {
  return new Promise((resolve, reject) => {
    ehbAppJssdk.network.request({
      url: 'https://prod-gateway.ehbapp.hubei.gov.cn/ded62a5440c141b2aab53399d9475394',
      method: 'post',
      data: params,
      headers: {
        'X-hbzw-Api-Key': '70e34b3b-bafe-4987-a268-a427052de696'
      },
      needToken: 'no',
      success: function (result) {
        resolve(result)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}
