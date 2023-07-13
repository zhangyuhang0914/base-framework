"use strict";
const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const path = require("path");
const Store = require("electron-store");
if (require("electron-squirrel-startup")) {
  app.quit();
}
const createWindow = () => {
  const electronStore = new Store();
  const webBrowserWindow = new BrowserWindow({
    width: 1e3,
    height: 800,
    // frame: false, // 无窗口
    // fullscreen: true, // 全屏
    // minimizable: false, // 决定窗口是否可被用户手动最小化
    // alwaysOnTop: false, // 窗口是否永远在别的窗口的上面
    // resizable: false, // 禁止改变主窗口尺寸
    // icon: '', // 窗口图标
    webPreferences: {
      contextIsolation: false,
      // 沙箱 上下文隔离
      nodeIntegration: true
      // 允许html页面上的 javascipt 代码访问 nodejs 环境api代码的能力（与node集成的意思）
      // preload: path.join(__dirname, 'preload.js')
      // backgroundThrottling: false,   // 设置应用在后台正常运行
    }
  });
  if (process.env.NODE_ENV !== "development") {
    webBrowserWindow.loadFile(path.join(__dirname, "../index.html"));
  } else {
    webBrowserWindow.loadURL(process.env["VITE_DEV_SERVER_URL"]);
  }
  const session = webBrowserWindow.webContents.session;
  session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === "securityPolicy") {
      const contentSecurityPolicy = "default-src 'self'; script-src 'self'";
      return callback(contentSecurityPolicy);
    }
  });
  webBrowserWindow.webContents.openDevTools();
  webBrowserWindow.webContents.on("before-input-event", (event, keyborad) => {
    if (keyborad.control && keyborad.shift && keyborad.key.toLowerCase() === "i")
      ;
  });
  webBrowserWindow.webContents.on("did-finish-load", () => {
    webBrowserWindow.webContents.send("store-instance", electronStore.store);
  });
  ipcMain.on("quit-app", (event, data) => {
    if (data) {
      app.quit();
    }
  });
  ipcMain.on("set-store-data", (event, key, value) => {
    electronStore.set(key, value);
  });
  ipcMain.on("get-store-data", (event, key) => {
    const data = electronStore.get(key);
    event.reply("get-data-reply", { key, data });
  });
  ipcMain.on("delete-store-data", (event, key) => {
    console.log("delete-store-data", key);
    electronStore.delete(key);
  });
};
app.whenReady().then(() => {
  createWindow();
  globalShortcut.register("CommandOrControl+Tab", () => {
    app.quit();
  });
});
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
