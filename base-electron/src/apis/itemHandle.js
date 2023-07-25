import axios from '@/commons/http'

/*
* 保存业务表单
* */
export const saveFormData = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/api/otherApp/saveOrUpdateFormData', params).then(response => {
      resolve(response.data)
    }).catch(error => {
      reject(error.data)
    })
  })
}
