// 解析URL
const parseUrl = (
  url: string
): {
  hostname: string
  port: string
  path: string
  params: Record<string, string>
} => {
  const urlObj = new URL(url)
  // 提取域名/IP 地址
  const { hostname } = urlObj
  // 提取端口
  const port = urlObj.port || (urlObj.protocol === 'https:' ? '443' : '80') // 如果没有明确的端口，根据协议指定默认端口
  // 提取路径
  const path = urlObj.pathname
  // 提取查询参数
  const { searchParams } = urlObj
  const params: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  return {
    hostname,
    port,
    path,
    params
  }
}

// 发送消息
const sendMessage = (action: string, data?: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action, data }, (response: any) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(response)
      }
    })
  })
}

// 自动登录
const authAutoLogin = () => {
  const inputElements = document.getElementsByClassName('el-input__inner')
  // 用户名
  const usernameInput = inputElements[0] as HTMLInputElement
  usernameInput.value = 'shengjudfjr'
  usernameInput.dispatchEvent(new Event('input'))
  // 密码
  const passwordInput = inputElements[1] as HTMLInputElement
  passwordInput.value = 'hbjr1234'
  passwordInput.dispatchEvent(new Event('input'))
  // 验证码
  const veryCodeInput = inputElements[2] as HTMLInputElement
  const veryImage = document.getElementsByTagName('img')[0]
  sendMessage('getVeryCode', veryImage.src).then((veryCode: string) => {
    veryCodeInput.value = veryCode
    veryCodeInput.dispatchEvent(new Event('input'))
    // 登录
    const loginButton = document.getElementsByClassName(
      'el-button'
    )[0] as HTMLButtonElement
    loginButton.click()
  })
}

window.onload = () => {
  console.log('content_scripts')
  sendMessage('getTabs').then((result: any) => {
    const currentWindow = result
    console.log('currentWindow', currentWindow)
    // ip/域名 端口 页面路径 参数
    const { hostname, port, path, params } = parseUrl(currentWindow.url)
    console.log('parseUrl', hostname, port, path, params)
    // 判断执行脚本环境
    if (
      currentWindow.url.indexOf('type=autoLogin') > -1 ||
      params.type === 'autoLogin'
    ) {
      // 湖北省委金融办金融管理平台
      if (hostname === '223.76.234.21') {
        // authAutoLogin()
        sendMessage('injectScript').then(result => {
          console.log('result', result)
        })
      }
    }
  })
}
