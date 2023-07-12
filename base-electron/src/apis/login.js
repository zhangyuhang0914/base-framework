import http from '@/commons/http'

/*
 * 登录
 * */
export const login = param => {
  const params = {
    method: 'post',
    url: '/sys/login',
    json: true,
    secure: 'YES',
    data: param
  }
  return http(params)
}

/*
 * 国密
 * */
export const initConfig = param => {
  const params = {
    method: 'post',
    url: '/api/gm/config/initConfig',
    json: true,
    data: param
  }
  return http(params)
}

/*
 * 查询账号加密方式
 * */
export const isUserBindUKey = username => {
  const params = {
    method: 'get',
    url: `/api/gm/config/isUserBindUKey?username=${username}`,
    json: true
  }
  return http(params)
}
