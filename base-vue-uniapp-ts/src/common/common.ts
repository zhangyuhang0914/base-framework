/**
 * 路由跳转（避免navigateTo使用过多，超过上限10个页面栈，导致小程序卡死）
 * @param {*} url 跳转路由
 * @param {*} callback 成功回调
 */
export const linkJump = (url: string, callback?: Function, customType?: string) => {
  if (!url) return false
  let newUrl = url
  // 过滤首位/
  if (url[0] === '/') {
    newUrl = url.substring(1)
  }

  let pathname
  // 过滤参数
  if (newUrl.indexOf('?') > -1) {
    pathname = newUrl.split('?')[0]
  } else {
    pathname = newUrl
  }

  const tabBarUrl = ['pages/index/index', 'pages/financeProduct/index', 'pages/policyNews/index', 'pages/user/index']
  const page = getCurrentPages()
  const index = page.findIndex(item => item.route === pathname)
  // 是否跳转Tab栏页面
  if (tabBarUrl.includes(pathname)) {
    uni.switchTab({
      url: url,
      success: () => {
        callback && callback()
      }
    })
    return false
  }
  console.log('customType', customType, url)
  if (customType === 'redirectTo') {
    uni.redirectTo({
      url: url,
      success: () => {
        callback && callback()
      }
    })
    return false
  }
  // 页面栈中是否已存在
  if (index > -1) {
    // 获取页面栈中存在的路由
    const step = page.length - 1 - index
    // 没有找到则重定向到该路由
    if (step === 0) {
      uni.redirectTo({
        url: url,
        success: () => {
          callback && callback()
        }
      })
    } else {
      // 找到则返回到该路由
      callback && callback()
      uni.navigateBack({
        delta: step,
        success: () => {
          callback && callback()
        }
      })
    }
    return false
  }
  // 如果不是跳转Tab栏页面 也没有找到已存在页面栈 则直接跳转
  uni.navigateTo({
    url: url,
    success: () => {
      callback && callback()
    }
  })
}

/**
 * 路由返回
 * @param {*} data 传递参数
 * @param {*} callback 成功回调
 */
export const goBack = (data?: AnyObject, callback?: Function) => {
  uni.navigateBack({
    delta: 1,
    success: () => {
      if (data && JSON.stringify(data) !== '{}') {
        // 获取当前页面栈实例（此时最后一个元素为当前页）
        let pages = getCurrentPages()
        // 上一页面实例
        // 注意是length长度，所以要想得到上一页面的实例需要 -2，上上页面的实例就 -3，以此类推
        let prevPage = pages[pages.length - 2]
        if (pages.length <= 1) {
          prevPage = pages[0]
        }
        // 上一页面实例绑定getOptionValue()方法和参数（注意是$vm）
        prevPage.$vm.getOptionValue(data)
      }
      callback && callback()
    }
  })
}
