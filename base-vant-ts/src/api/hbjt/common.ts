import http from '@/commons/http/http'
import { httpRequestConfig } from '@/commons/http/types.d'

export const getList = (params: { url: string; page: number }) => {
  const param: httpRequestConfig = {
    url: `/api/haiyun/all`,
    params: params
  }
  return http.get(param)
}
