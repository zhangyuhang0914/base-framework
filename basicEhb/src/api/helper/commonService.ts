/*
 * 公共服务
 */

import type { ItemInfosEhbItem, ItemInfosEhbParam } from '@/api/interface/commonService'
import { post, type httpRequestConfig } from '@/common/http/index'
import type { ApiPageResponse } from '@/common/interface/http'

// 查询事项列表
export const itemInfosEhbList = (
  params: ItemInfosEhbParam
): Promise<ApiPageResponse<ItemInfosEhbItem>> => {
  const param: httpRequestConfig = {
    url: '/iteminfos/ehb/list',
    cacheFor: {
      mode: 'memory',
      expire: 0
    },
    data: params
  }
  return post(param)
}
