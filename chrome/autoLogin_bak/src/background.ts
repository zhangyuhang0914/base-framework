console.log('background:chrome', chrome)
const background = {
  BASE_URL: '172.16.52.136:80',
  constant: {
    websiteUrlArr: 'http://223.76.234.21:*/manager/index.html*;'
  },
  fun: {
    // 初始化
    init() {
      background.fun.setSystemWebsiteUrlArr()
      background.fun.addListener()
      background.fun.registerContentScripts()
    },
    // 存储默认网站监测系统域名
    setSystemWebsiteUrlArr() {
      chrome.storage.local.set({
        websiteUrlArr: background.constant.websiteUrlArr
      })
    },
    // 获取url源
    getOrigin(url: string) {
      const nUrl: any = new URL(url)
      const { origin } = nUrl
      return `${origin}/*`
    },
    // 注册内容脚本
    registerContentScripts() {
      console.log('registerContentScripts', background.constant.websiteUrlArr)
      chrome.scripting
        // @ts-ignore
        .registerContentScripts([
          {
            id: 'content-script',
            js: ['static/content_scripts/content_scripts.js'],
            matches: ['<all_urls>']
            // matches: background.constant.websiteUrlArr
            //   .split(';')
            //   .filter(Boolean)
          }
        ])
        .then(() => console.log('success'))
        .catch((err: any) => console.warn('error', err))
    },
    // 取消注册脚本
    unregisterContentScripts() {
      chrome.scripting
        // @ts-ignore
        .unregisterContentScripts()
        .then(() => console.log('success'))
        .catch((err: any) => console.warn('error', err))
    },
    // 获取执行脚本内容
    getScriptContent(hostname: string) {
      return new Promise((resolve, reject) => {
        const scriptText = `const inputElements = document.getElementsByClassName('el-input__inner')
                            // 用户名
                            const usernameInput = inputElements[0]
                            usernameInput.value = 'shengjudfjr'
                            usernameInput.dispatchEvent(new Event('input'))
                            // 密码
                            const passwordInput = inputElements[1]
                            passwordInput.value = 'hbjr1234'
                            passwordInput.dispatchEvent(new Event('input'))
                            // 验证码
                            const veryCodeInput = inputElements[2]
                            veryCodeInput.value = 'tzr7'
                            veryCodeInput.dispatchEvent(new Event('input'))
                            // 登录
                            const loginButton = document.getElementsByClassName(
                              'el-button'
                            )[0]
                            loginButton.click()`
        resolve(scriptText)
        // fetch(`${background.BASE_URL}/api/detection/core/dataCheck`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'text/plain'
        //   },
        //   body: hostname
        // })
        //   .then(response => response.json())
        //   .then((result: any) => {
        //     if (`${result.code}` === '0') {
        //       const { data } = result
        //       resolve(data)
        //     }
        //   })
        //   .catch(error => {
        //     // 发生错误时的处理逻辑
        //     console.error(error)
        //     reject(error)
        //   })
      })
    },
    // 监听消息
    addListener() {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        // 请求对象包括请求方法、请求地址、请求参数等信息
        const { action } = request
        console.log(request, sender, sendResponse)
        // 设置检测域名/IP
        if (action === 'setWebsiteUrlArr') {
          const { data } = request
          if (data) {
            background.constant.websiteUrlArr = data
            background.fun.registerContentScripts()
          }
        }
        // 处理获取tabs
        if (action === 'getTabs') {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            (tabs: any) => {
              const activeTab = tabs[0]
              console.log('activeTab', tabs, activeTab)
              chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                files: ['./test.js']
              })
              sendResponse(activeTab)
            }
          )
          return true
        }
        // 获取执行脚本内容
        if (action === 'getScriptContent') {
          const { data } = request
          console.log('getScriptContent-data', data)
          background.fun.getScriptContent(data).then(scriptContentReulst => {
            console.log(
              'getScriptContent-scriptContentReulst',
              scriptContentReulst
            )
            sendResponse(scriptContentReulst)
          })
          return true
        }
        // 注意：return true表示异步发送消息，return false表示同步发送消息
        return true
      })
    }
  }
}
console.log('background', background)
// 监听插件首次安装
chrome.runtime.onInstalled.addListener((details: any) => {
  // 首次安装或者更新默认关闭检测
  console.log('details', details)
  background.fun.setSystemWebsiteUrlArr()
  background.fun.init()
})
background.fun.init()
