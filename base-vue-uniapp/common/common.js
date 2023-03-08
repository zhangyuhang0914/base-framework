/**
 * @Desc         :
 * @Autor        : ZYH
 * @Date         : 2023-02-17 16:04:45
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-03-06 09:32:24
*/

// 路由跳转（避免navigateTo使用过多，超过上限10个页面栈，导致小程序卡死）
export const linkJump = (url, callback) => {
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

  const tabBarUrl = ['pages/index/index', 'pages/affairs/index', 'pages/work-service/index', 'pages/user/index']
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
      uni.navigateBack({ delta: step })
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
