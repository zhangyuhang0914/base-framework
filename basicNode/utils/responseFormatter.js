/**
 * 响应格式化工具
 * 用于统一处理API响应格式，减少代码重复
 */

/**
 * 生成成功响应
 * @param {Object} res - Express响应对象
 * @param {*} data - 响应数据
 * @param {number} code - HTTP状态码，默认为200
 */
function successResponse (res, data, code = 200) {
  return res.status(code).json({
    code,
    data: data || {}
  })
}

/**
 * 生成错误响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误信息
 * @param {number} code - HTTP状态码，默认为400
 * @param {Object} errorData - 额外的错误数据，只在开发环境下使用
 */
function errorResponse (res, message, code = 400, errorData = null) {
  const response = {
    code,
    data: {},
    message
  }
  // 在开发环境下，可以包含额外的错误信息
  if (process.env.NODE_ENV === 'development' && errorData) {
    response.data = {
      ...response.data,
      ...errorData
    }
  }
  return res.status(code).json(response)
}

module.exports = {
  successResponse,
  errorResponse
}
