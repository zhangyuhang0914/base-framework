/*
 * 用户相关
 */

import { get, post } from '@/common/http/index'

/**
 * 查询数据统计
 * @param params 登录参数
 */
export const countDisplay = () => {
  const params = {
    url: '/api/fin/loan/countDisplay'
  }
  return get(params)
}
