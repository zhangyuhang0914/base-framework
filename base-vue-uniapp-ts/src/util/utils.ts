import type { DictListItem } from '@/api/index/types'
import { loading, toast } from '@/common/uni-utils'
import { preview } from '@/api/common'
import imgConstant from '@/common/imgConstant'

/**
 * 本地图片转换base64
 * @param {*} folder 文件夹名称
 * @param {*} fileName 文件名称
 * @param {*} format 文件后缀
 */
export const getLocalImgToBase64 = (folder: string, fileName: string, format = 'png') => {
  const imgUrl = `/static/${folder}/${fileName}.${format}`
  const base64 = uni.getFileSystemManager().readFileSync(imgUrl, 'base64')
  return `data:image/png;base64,${base64}`
}

/**
 * 根据 key 获取字典数据
 * @param {*} key key
 * @param {*} list 字典列表
 */
export const getDicValue = (key: string, list: DictListItem[]) => {
  const foundItem = list.find(item => item.value + '' === key + '')
  return foundItem ? foundItem.name : ''
}

/**
 * 处理担保方式
 * @param {*} value 担保模式
 * @param {*} arr 字典列表
 * @param {*} guaranteeModeExtra 多种担保方式
 */
export const formatMode = (value: string, arr: DictListItem[], guaranteeModeExtra: string | null) => {
  if (!guaranteeModeExtra) {
    for (let i = 0; i < arr.length; i++) {
      if (value + '' === arr[i].value) {
        return arr[i].name
      }
    }
  } else {
    if (guaranteeModeExtra.split(',').length === 1) {
      value = guaranteeModeExtra.split(',')[0]
      for (let i = 0; i < arr.length; i++) {
        if (value + '' === arr[i].value) {
          return arr[i].name
        }
      }
    } else {
      value = guaranteeModeExtra
      let modeArr = ''
      const valueArr = value.split(',')
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < valueArr.length; j++) {
          if (valueArr[j] == arr[i].value) {
            modeArr += arr[i].name + ','
          }
        }
      }
      modeArr = modeArr.substring(0, modeArr.length - 1)
      return modeArr
    }
  }
}

/**
 * 将数组拼装成字符串
 * @param {Array} str - 数组
 * @param {string} [separator=','] - 分隔符
 * @returns {string} - 字符串
 * @example
 * // '张三,李四,王五'
 * Tools.joinArr(['张三','李四','王五']);
 * // '张三.李四.王五'
 * Tools.joinArr(['张三','李四','王五'],'k2','.');
 */
export const joinArr = (arr: Array<string>, separator?: string) => {
  separator = separator || ','
  if (arr) {
    return arr.join(separator)
  } else {
    return ''
  }
}

// 判断是否为身份证号码，如果是，则中间的10位用*号展示
export const maskIdCard = (idCard: string) => {
  const reg = /^\d{6}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/
  if (reg.test(idCard)) {
    return idCard.replace(/(\d{6})\d{10}(\d{2})/, '$1**********$2')
  }
  return idCard
}
// 判断是否为手机号码，如果是，则中间的5位用*号展示
export const maskPhoneNumber = (phoneNumber: string) => {
  const reg = /^1[3-9]\d{9}$/
  if (reg.test(phoneNumber)) {
    return phoneNumber.replace(/(\d{3})\d{5}(\d{3})/, '$1*****$2')
  }
  return phoneNumber
}

// 判断图片文件类型
export const getImageExtension = (filename: string) => {
  // 正则表达式匹配文件扩展名
  const match = filename.match(/\.(?:jpg|jpeg|png|gif|bmp|webp)$/i)
  return match ? match[0] : ''
}

/**
 * 获取格式化时间
 * @param {timestamp} 时间戳
 * @param {joinStr} 分隔符
 */
export const getFormatDate = (timestamp: number | string, joinStr: string) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // getMonth() returns 0-11
  const day = String(date.getDate()).padStart(2, '0') // getDate() returns 1-31
  return `${year}${joinStr}${month}${joinStr}${day}`
}

// 文件下载
export const handleDownloadFile = (url: string, isImg: string, fileType: string) => {
  loading.show()
  uni.downloadFile({
    url: url,
    success: (res: AnyObject) => {
      const filePath = res.tempFilePath
      if (res.statusCode === 200) {
        // 预览图片
        if (isImg) {
          uni.previewImage({
            urls: [filePath],
            success: function (res) {
              console.log('图片预览成功')
            },
            fail: () => {
              toast.show('图片预览失败', 'none', 3000)
            }
          })
        } else {
          const formattedDate = new Date().toISOString().replace(/[-:.]/g, '')
          uni.saveFile({
            tempFilePath: filePath,
            // @ts-ignore
            filePath: `${wx.env.USER_DATA_PATH}/授权协议_${formattedDate}.pdf`,
            success: saveRes => {
              // 预览文件
              uni.openDocument({
                filePath: saveRes.savedFilePath,
                fileType: fileType,
                showMenu: true,
                success: function (res) {
                  console.log('打开文档成功')
                },
                fail: () => {
                  toast.show('打开文件失败', 'none', 3000)
                }
              })
            },
            fail: saveErr => {
              toast.show('保存文件失败', 'none', 3000)
            }
          })
        }
      }
    },
    fail: (err: AnyObject) => {
      console.log(err)
      toast.show('下载文件失败', 'none', 3000)
    },
    complete: () => {
      loading.hide()
    }
  })
}

/**
 * 预览图片
 * type: 预览图片类型(local:本地;online: 线上)
 */
export const previewImg = (key: string, type: string = 'online') => {
  if (!key) return
  const keyArr = key.split('_')
  // 预览本地图片
  if (type === 'local') {
    return getLocalImgToBase64(keyArr[1], keyArr[2])
  }
  // 预览线上图片
  if (type === 'online') {
    return preview(imgConstant[key])
  }
}

/**
 * 节流函数
 * @param {*} fn 执行函数
 * @param {*} delay 延迟时间
 */
export const throttle = (fn: Function, delay: number = 300, first: boolean = true) => {
  let timer: any = null
  return function (this: any, ...params: any) {
    let self = this // 取debounce执行作用域的this
    if (first) {
      fn.apply(self, params)
      first = false
      return
    }
    if (timer) {
      return
    }
    timer = setTimeout(function () {
      fn.apply(self, params)
      timer = null
    }, delay)
  }
}

/**
 * 防抖函数
 * @param {*} fn 要执行的方法
 * @param {*} delay 延迟
 */
export const debounce = (fn: Function, delay: number = 300) => {
  let timer: any // 维护一个 timer
  return function (this: any) {
    let self = this // 取debounce执行作用域的this
    let args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      fn.apply(self, args) // 用apply指向调用debounce的对象，相当于_this.fn(args);
    }, delay)
  }
}
