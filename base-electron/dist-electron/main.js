"use strict";
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
if (require("electron-squirrel-startup")) {
  app.quit();
}
const createWindow = () => {
  const webBrowserWindow = new BrowserWindow({
    width: 1e3,
    height: 800,
    webPreferences: {
      contextIsolation: false,
      // 沙箱 上下文隔离
      nodeIntegration: true
      // 允许html页面上的 javascipt 代码访问 nodejs 环境api代码的能力（与node集成的意思）
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
