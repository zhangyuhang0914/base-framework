// 全局错误处理中间件
const logger = require('../utils/logger')
const { errorResponse } = require('../utils/responseFormatter')

// 错误类型定义
class ApiError extends Error {
  constructor(statusCode, message, errorCode = null) {
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}
// 处理404错误
const handleNotFound = (req, res, next) => {
  const error = new ApiError(404, `请求的资源 ${req.originalUrl} 不存在`)
  next(error)
}
// 处理开发环境错误
const handleDevelopmentError = (err, req, res) => {
  logger.error('开发环境错误:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query
  })
  const statusCode = err.statusCode || 500
  const errorData = {
    errorCode: err.errorCode,
    stack: err.stack,
    error: err
  }
  return errorResponse(res, err.message || '服务器内部错误', statusCode, errorData)
}
// 处理生产环境错误
const handleProductionError = (err, req, res) => {
  // 只记录操作错误的详细信息
  if (err.isOperational) {
    logger.error('生产环境操作错误:', {
      statusCode: err.statusCode,
      message: err.message,
      errorCode: err.errorCode,
      path: req.path,
      method: req.method
    })
    const errorData = {
      errorCode: err.errorCode
    }
    return errorResponse(res, err.message, err.statusCode, errorData)
  }
  // 未预期的错误只记录基本信息
  logger.error('生产环境未预期错误:', {
    message: err.message,
    path: req.path,
    method: req.method
  })
  return errorResponse(res, '服务器内部错误，请稍后再试', 500)
}
// 全局错误处理中间件
const errorHandler = (err, req, res, next) => {
  // 设置默认状态码
  err.statusCode = err.statusCode || 500
  // 根据环境选择错误处理方式
  if (process.env.NODE_ENV === 'development') {
    handleDevelopmentError(err, req, res)
  } else {
    handleProductionError(err, req, res)
  }
}
// 验证中间件
const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body)
      if (error) {
        return next(new ApiError(400, error.details[0].message, 'VALIDATION_ERROR'))
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = {
  ApiError,
  handleNotFound,
  errorHandler,
  validateRequest
}
