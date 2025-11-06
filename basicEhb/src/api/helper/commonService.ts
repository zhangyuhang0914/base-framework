/*
 * 公共服务
 */

import type { ItemInfosEhbItem, ItemInfosEhbParam } from '@/api/interface/commonService'
import { post, type ApiResponse, type httpRequestConfig } from '@/common/http/index'

// 查询事项列表
export const itemInfosEhbList = (
  params: ItemInfosEhbParam
): Promise<ApiResponse<ItemInfosEhbItem>> => {
  const param: httpRequestConfig = {
    url: '/iframework/iteminfos/ehb/list',
    cacheFor: {
      mode: 'memory',
      expire: 0
    },
    data: params
  }
  return post(param)
}
