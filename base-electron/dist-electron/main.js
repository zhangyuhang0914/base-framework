"use strict";
const { app, BrowserWindow, ipcMain } = require("electron");
const Store = require("electron-store");
const path = require("path");
if (require("electron-squirrel-startup")) {
  app.quit();
}
const electronStore = new Store();
const createWindow = () => {
  const webBrowserWindow = new BrowserWindow({
    width: 1e3,
    height: 800,
    // frame: false, // 无窗口
    // fullscreen: true, // 全屏
    // minimizable: false, // 决定窗口是否可被用户手动最小化
    // alwaysOnTop: false, // 窗口是否永远在别的窗口的上面
    // resizable: false, // 禁止改变主窗口尺寸
    webPreferences: {
      contextIsolation: false,
      // 沙箱 上下文隔离
      nodeIntegration: true
      // 允许html页面上的 javascipt 代码访问 nodejs 环境api代码的能力（与node集成的意思）
      // webSecurity: false // 跨域
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
};
app.whenReady().then(createWindow);
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
ipcMain.handle("getElectronSore", () => {
  return electronStore;
});
