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
  veryCodeInput.value = 'tzr7'
  veryCodeInput.dispatchEvent(new Event('input'))
  // 登录
  const loginButton = document.getElementsByClassName(
    'el-button'
  )[0] as HTMLButtonElement
  loginButton.click()
}

// 执行js脚本
const loadJsResources = (scriptContent: string) => {
  if (!scriptContent) return
  return new Promise((resolve, reject) => {
    const element = document.createElement('script')
    element.nonce = 'alsdjlashdlajshdklahs'
    element.onload = resolve
    element.onerror = reject
    element.textContent = scriptContent
    document.head.appendChild(element)
  })
}

// 执行脚本
const scriptHandle = (scriptContent: string) => {
  loadJsResources(scriptContent)?.then(() => {})
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

window.onload = () => {
  console.log('content_scripts')
  // chrome.storage.local.get(['websiteUrlArr'], (result: any) => {
  //   const { websiteUrlArr } = result

  sendMessage('getTabs').then((result: any) => {
    const currentWindow = result
    console.log('currentWindow', currentWindow, authAutoLogin)
    // ip/域名 端口 页面路径 参数
    const { hostname, port, path, params } = parseUrl(currentWindow.url)
    // console.log('websiteUrlArr', websiteUrlArr, currentWindow)
    console.log('parseUrl', hostname, port, path, params)
    // 判断执行脚本环境
    console.log('indexOf', currentWindow.url.indexOf('type=autoLogin') > -1)
    // if (
    //   currentWindow.url.indexOf('type=autoLogin') > -1 ||
    //   params.type === 'autoLogin'
    // ) {
    //   sendMessage('getScriptContent', hostname).then((scriptContent: any) => {
    //     console.log('scriptContent', scriptContent)
    //     scriptHandle(scriptContent)
    //   })
    // }
  })

  // chrome.runtime.sendMessage({ action: 'getTabs' }, (tab: any) => {
  //   const currentWindow = tab
  //   console.log('currentWindow', currentWindow, authAutoLogin)
  //   // ip/域名 端口 页面路径 参数
  //   const { hostname, port, path, params } = parseUrl(currentWindow.url)
  //   // console.log('websiteUrlArr', websiteUrlArr, currentWindow)
  //   console.log('parseUrl', hostname, port, path, params)
  //   // 判断执行脚本环境
  //   console.log('indexOf', currentWindow.url.indexOf('type=autoLogin') > -1)
  //   if (
  //     currentWindow.url.indexOf('type=autoLogin') > -1 ||
  //     params.type === 'autoLogin'
  //   ) {
  //     chrome.runtime.sendMessage(
  //       { action: 'getScriptContent', data: hostname },
  //       (scriptContent: string) => {
  //         console.log('scriptContent', scriptContent)
  //         scriptHandle(scriptContent)
  //       }
  //     )
  //   }
  // })
  // })
}
