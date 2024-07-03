console.log('background:chrome', chrome)
const background = {
  BASE_URL: 'http://192.168.1.246:16002/jgmh/api',
  constant: {
    websiteUrlArr: 'http://223.76.234.21:*/manager/index.html*;'
  },
  fun: {
    // 初始化
    init() {
      background.fun.setSystemWebsiteUrlArr()
      background.fun.addListener()
      // background.fun.registerContentScripts()
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
      chrome.scripting
        // @ts-ignore
        .registerContentScripts([
          {
            id: 'content-script',
            js: ['static/content_scripts/content_scripts.js'],
            matches: ['<all_urls>']
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
    blobToBase64(blobUrl: string): Promise<string> {
      return new Promise((resolve, reject) => {
        fetch(blobUrl)
          .then(response => response.blob())
          .then(blob => {
            // 使用 FileReader 读取 Blob 数据
            const reader: any = new FileReader()
            reader.onload = () => {
              // 读取完成后的回调函数
              const base64String = reader.result.split(',')[1] // 去除 data URL 的头部
              console.log(base64String) // 输出 base64 格式的字符串
              resolve(base64String)
            }
            reader.readAsDataURL(blob) // 开始读取 Blob 数据
          })
          .catch(() => {
            reject()
          })
      })
    },
    // 获取脚本内容
    getScriptContent(): Promise<string> {
      return new Promise((resolve, reject) => {
        fetch(
          'https://jrb.hubei.gov.cn/szxqyxyxx/enterprise/js/enterprise-config.js',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'text/plain'
            }
          }
        )
          .then(response => {
            console.log('response', response)
            return response.text()
          })
          .then(scriptContent => {
            // 打印获取到的脚本内容
            console.log('scriptContent', scriptContent)
            // 解析成功
            resolve(scriptContent)
          })
          .catch(error => {
            // 解析失败
            reject(error)
          })
      })
    },
    // 通过base64图片验证获取value
    getVeryCode(base64String: string): Promise<string> {
      return new Promise((resolve, reject) => {
        fetch(`${background.BASE_URL}/third/aliyun/recognitionCaptcha`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ imgBase64Data: base64String })
        })
          .then(response => {
            return response.json()
          })
          .then(result => {
            console.log('通过base64图片验证获取value', result)
            if (result.code === 0) {
              resolve(result.data)
            }
            reject()
          })
          .catch(() => {
            reject()
          })
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
            // background.fun.registerContentScripts()
          }
        }
        // 处理获取tabs
        if (action === 'getTabs') {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            (tabs: any) => {
              const activeTab = tabs[0]
              console.log('activeTab', tabs, activeTab)
              sendResponse(activeTab)
            }
          )
          return true
        }
        // 脚本注入
        if (action === 'injectScript') {
          chrome.scripting.executeScript(
            {
              target: { tabId: 2000531422 },
              // @ts-ignore
              func: url => {
                const script = document.createElement('script')
                script.src = url
                document.head.appendChild(script)
              },
              args: [
                'https://jrb.hubei.gov.cn/szxqyxyxx/enterprise/js/enterprise-config.js'
              ]
            },
            () => {
              sendResponse({ result: 'success' })
            }
          )
          return true
        }
        // 获取图形验证码
        if (action === 'getVeryCode') {
          const { data } = request
          console.log('getVeryCode-data', data)
          background.fun.blobToBase64(data).then((base64String: string) => {
            console.log('getVeryCode-scriptContentReulst', base64String)
            background.fun
              .getVeryCode(base64String)
              .then((veryCode: string) => {
                sendResponse(veryCode)
              })
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
