import { httpRequestConfig } from '@/commons/http/types.d'
import http from '@/commons/http/http-async'

// 交通要闻-通知公告-厅直动态-市州扫描-招标投标
export const getHandleList = (params: { url: string; page: number }) => {
  const param: httpRequestConfig = {
    url: '/api/haiyun/all',
    params: params
  }
  return http.get(param)
}
