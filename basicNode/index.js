// 主入口文件
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs-extra')
const config = require('./config')
const logger = require('./utils/logger')
const uploadRoutes = require('./routes/upload')
const { successResponse, errorResponse } = require('./utils/responseFormatter')

const app = express()
// 配置不同服务的API前缀
const baseApiPrefix = config.api.baseServer
const fileApiPrefix = config.api.fileServer
// 创建必要的目录
const createDirectories = async () => {
  try {
    await fs.ensureDir(config.upload.tempDir)
    await fs.ensureDir(config.upload.uploadDir)
    await fs.ensureDir(config.logger.directory)
    logger.info('所有必要的目录已创建')
  } catch (error) {
    logger.error('创建目录失败:', error)
    process.exit(1)
  }
}

// 中间件配置
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
// CORS配置
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})
// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
// 路由配置
app.use('/', uploadRoutes)
// 健康检查接口
app.get(baseApiPrefix + '/health', (req, res) => {
  return successResponse(res, {
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})
// 404处理
app.use((req, res) => {
  return errorResponse(res, '资源不存在', 404)
})
// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error('请求处理错误:', err)
  return errorResponse(res, '服务器内部错误', 500)
})

// 启动服务器
const startServer = async () => {
  try {
    await createDirectories()
    app.listen(config.server.port, config.server.host, () => {
      logger.info(`服务器启动成功，访问地址: http://${config.server.host}:${config.server.port}`)
    })
  } catch (error) {
    logger.error('服务器启动失败:', error)
    process.exit(1)
  }
}

startServer()

// 进程退出处理
process.on('SIGINT', () => {
  logger.info('服务器正在关闭...')
  process.exit(0)
})
process.on('unhandledRejection', (reason, promise) => {
  logger.error('未处理的Promise拒绝:', reason)
})
process.on('uncaughtException', (error) => {
  logger.error('未捕获的异常:', error)
  process.exit(1)
})
