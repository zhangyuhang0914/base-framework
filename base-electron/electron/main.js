// app 控制应用程序的事件生命周期
const { app, BrowserWindow, ipcMain } = require('electron')
const Store = require('electron-store')
const path = require('path')

// 解决安装包重复启动问题
if (require('electron-squirrel-startup')) {
  app.quit()
}

// 实例化 electron-store
const electronStore = new Store()

// 定义全局变量 获取窗口实力
const createWindow = () => {
  // BorwserWindow 创建并控制浏览器窗口
  const webBrowserWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    // frame: false, // 无窗口
    // fullscreen: true, // 全屏
    // minimizable: false, // 决定窗口是否可被用户手动最小化
    // alwaysOnTop: false, // 窗口是否永远在别的窗口的上面
    // resizable: false, // 禁止改变主窗口尺寸
    // icon: '', // 窗口图标
    webPreferences: {
      contextIsolation: false, // 沙箱 上下文隔离
      nodeIntegration: true, // 允许html页面上的 javascipt 代码访问 nodejs 环境api代码的能力（与node集成的意思）
      // webSecurity: false, // 跨域
    }
  })
  // 判断开发环境 或者使用 isPackaged 判断应用是否已打包
  if (process.env.NODE_ENV !== 'development') {
    webBrowserWindow.loadFile(path.join(__dirname, '../index.html'))
  } else {
    // package.json 中 chcp 65001 解决中文乱码问题
    // console.log('webBrowserWindow', process, process.env['VITE_DEV_SERVER_URL'])
    // 测试地址
    // webBrowserWindow.loadURL('https://www.baidu.com/')
    webBrowserWindow.loadURL(process.env['VITE_DEV_SERVER_URL'])
  }
  // 获取当前窗口的会话对象
  const session = webBrowserWindow.webContents.session
  // 设置内容安全策略
  session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'securityPolicy') {
      // 设置自定义的内容安全策略
      const contentSecurityPolicy = "default-src 'self'; script-src 'self'"
      // 将内容安全策略返回给渲染进程
      return callback(contentSecurityPolicy)
    }
  })
  // 开发者工具（开发环境调试专用）
  webBrowserWindow.webContents.openDevTools()
}

// Electron已完成初始化时被触发 假如应用程序尚未就绪 则订阅ready事件
app.whenReady().then(createWindow)
// 当所有的窗口都被关闭时触发
app.on('window-all-closed', () => {
  // 查询操作系统
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// 当应用被激活时触发
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 主进程传入store状态到渲染层
ipcMain.handle('getElectronSore', () => {
  return electronStore
})
