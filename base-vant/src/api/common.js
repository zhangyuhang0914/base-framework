import axios from '../utils/request'

/*
* 测试
* */
export const ownerInfoList = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/api/mms/message/main/ownerInfoList', params).then(response => {
      resolve(response.data)
    }).catch(error => {
      reject(error.data)
    })
  })
}
