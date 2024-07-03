/**
 * @Desc         :
 * @Autor        : ZYH
 * @Date         : 2023-02-09 14:35:59
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-03-07 19:37:09
*/

export const formatTime = date => {
  date = date ? date : new Date()

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

export const getFileFormat = file => {
  if (!file) {
    return ''
  } else {
    let fileName = file.lastIndexOf(".")//取到文件名开始到最后一个点的长度
    let fileNameLength = file.length//取到文件名长度
    let fileFormat = file.substring(fileName + 1, fileNameLength)//截
    return '.' + fileFormat
  }
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 获取数据类型
 * @param {*} obj
 */
export const getType = (obj) => {
  let type = Object.prototype.toString.call(obj).match(/^\[object (.*)\]$/)[1].toLowerCase()
  if (type === 'string' && typeof obj === 'object') return 'object' // Let "new String('')" return 'object'
  if (obj === null) return 'null' // PhantomJS has type "DOMWindow" for null
  if (obj === undefined) return 'undefined' // PhantomJS has type "DOMWindow" for undefined
  return type
}

/**
 * 判断是否空值
 * @param {*} v
 */
// 是否空值
export const isEmpty = (v) => {
  switch (typeof v) {
    case 'undefined':
      return true
    case 'string':
      if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length === 0) return true
      break
    case 'boolean':
      if (!v) return true
      break
    case 'number':
      if (v === 0 || isNaN(v)) return true
      break
    case 'object':
      if (v === null || v.length === 0) return true
      for (var i in v) {
        return false
      }
      return true
  }
  return false
}


/**
 * 列表转成树
 * @param {*} list list
 * @param {*} id node-key
 * @param {*} pid parent key
 * @param {*} childrenKey children key
 */
export const listToTree = (list, id = 'id', pkey = 'pid', childrenKey = 'children') => {
  const map = new Map()
  const newList = []
  list && list.forEach(item => {
    map.set(item[id], item)
  })
  map.forEach((item) => {
    if (map.has(item[pkey])) {
      const parent = map.get(item[pkey])
      parent[childrenKey] = parent[childrenKey] || []
      if (item.id) {
      }
      parent[childrenKey].push(item)
    } else {
      newList.push(item)
    }
  })
  return newList
}

/**
 * 获取树组件子元素
 * @param {*} ar
 */
export const getTreeArrChild = (children, isChild, chilrenName) => {
  let returnVal = []

  let childrenEach = (arr) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i][isChild]) {
        returnVal.push(arr[i])
      } else {
        if (arr[i][chilrenName] && arr[i][chilrenName].length) {
          childrenEach(arr[i][chilrenName])
        }
      }
    }
    return returnVal
  }
  return childrenEach(children)
}

/**
 * 获取文件后缀名
 * @param {*} fileName - 文件名称
 */
export const getFileSuffix = (fileName) => {
  if (fileName) {
    var index1 = fileName.lastIndexOf(".")
    var index2 = fileName.length
    var suffix = fileName.substring(index1 + 1, index2) //后缀名
    return suffix.toLowerCase()
  } else {
    return ''
  }
}

/**
 * 获取文件名称
 * @param {*} file - 文件
 */
export const getFileName = (file) => {
  if (file) {
    return JSON.parse(file).fileOriginalName
  }
}

/**
 * file to base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      console.log('file 转 base64结果：' + reader.result)
      resolve(reader.result)
    }
    reader.onerror = function (error) {
      console.log('Error: ', error)
      reject(error)
    }
  })
}

/**
 * base64 to fie
 */
export const base64ToFile = (urlData, fileName) => {
  let arr = urlData.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bytes = atob(arr[1]) // 解码base64
  let n = bytes.length
  let ia = new Uint8Array(n)
  while (n--) {
    ia[n] = bytes.charCodeAt(n)
  }
  return new File([ia], fileName, { type: mime })
}

/*******************************************************************
 * @name unique 对象数组根据某个属性去重
 * @prama attr 去重的属性
 * @return 去重后的数组
 ******************************************************************/
export function unique (arr, attr) {
  const res = new Map()

  const fArr = arr.filter((a) => !res.has(a[attr]) && res.set(a[attr], 1))
  console.log('对象数组根据某个属性去重', fArr)
  return fArr.filter(a => a[attr] && a[attr] !== 'undefined')
}

/**
 * 防抖函数
 * @param {*} fn 要执行的方法
 * @param {*} delay 延迟
 */
export const debounce = (fn, delay) => {
  let timer // 维护一个 timer
  return function () {
    let _this = this // 取debounce执行作用域的this
    let args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      fn.apply(_this, args) // 用apply指向调用debounce的对象，相当于_this.fn(args);
    }, delay)
  }
}

/**
 * 按钮权限码判断
 * @param {*} module 功能模块
 * @param {*} code 权限码
 */
export const hasPermission = (module, code) => {
  let moduleList = uni.getStorageSync(module)
  for (var i = 0; i < moduleList.length; i++) {
    if (moduleList[i].perms === code) {
      return true
    }
  }
  return false
}
