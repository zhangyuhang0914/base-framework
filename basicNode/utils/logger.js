// 日志工具
const fs = require('fs-extra')
const path = require('path')
const config = require('../config')

// 日志级别
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

class Logger {
  constructor() {
    this.logLevel = LOG_LEVELS[config.logger.level] || LOG_LEVELS.info
    this.logDirectory = config.logger.directory
    this.currentLogFile = null
    this.initLogFile()
  }
  // 初始化日志文件
  async initLogFile () {
    try {
      await fs.ensureDir(this.logDirectory)
      this.updateLogFile()
    } catch (error) {
      console.error('初始化日志文件失败:', error)
    }
  }
  // 更新日志文件（按天分割）
  updateLogFile () {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    this.currentLogFile = path.join(this.logDirectory, `${dateStr}.log`)
  }
  // 写入日志到文件
  async writeToFile (level, message, meta = {}) {
    try {
      // 检查是否需要更新日志文件（跨天）
      const today = new Date().toISOString().split('T')[0]
      const currentFileDate = path.basename(this.currentLogFile, '.log')
      if (today !== currentFileDate) {
        this.updateLogFile()
      }
      const timestamp = new Date().toISOString()
      const logEntry = {
        timestamp,
        level,
        message,
        meta
      }
      await fs.appendFile(this.currentLogFile, JSON.stringify(logEntry) + '\n')
    } catch (error) {
      console.error('写入日志文件失败:', error)
    }
  }
  // 格式化控制台输出
  formatConsoleOutput (level, message, meta = {}) {
    const timestamp = new Date().toLocaleString('zh-CN')
    const colors = {
      debug: '\x1b[36m', // 青色
      info: '\x1b[32m',  // 绿色
      warn: '\x1b[33m',  // 黄色
      error: '\x1b[31m', // 红色
      reset: '\x1b[0m'   // 重置
    }
    let output = `${colors[level]}[${timestamp}] [${level.toUpperCase()}] ${message}${colors.reset}`
    if (Object.keys(meta).length > 0) {
      output += ' ' + JSON.stringify(meta)
    }
    return output
  }
  // 日志方法
  debug (message, meta = {}) {
    if (this.logLevel <= LOG_LEVELS.debug) {
      console.log(this.formatConsoleOutput('debug', message, meta))
      this.writeToFile('debug', message, meta)
    }
  }
  info (message, meta = {}) {
    if (this.logLevel <= LOG_LEVELS.info) {
      console.log(this.formatConsoleOutput('info', message, meta))
      this.writeToFile('info', message, meta)
    }
  }
  warn (message, meta = {}) {
    if (this.logLevel <= LOG_LEVELS.warn) {
      console.warn(this.formatConsoleOutput('warn', message, meta))
      this.writeToFile('warn', message, meta)
    }
  }
  error (message, meta = {}) {
    if (this.logLevel <= LOG_LEVELS.error) {
      console.error(this.formatConsoleOutput('error', message, meta))
      this.writeToFile('error', message, meta)
    }
  }
}

// 导出单例
module.exports = new Logger()
