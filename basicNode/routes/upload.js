// 上传路由
const express = require('express')
const multer = require('multer')
const uploadService = require('../services/uploadService')
const logger = require('../utils/logger')
const config = require('../config')
const { successResponse, errorResponse } = require('../utils/responseFormatter')

const router = express.Router()
const requestBase = config.api.fileServer
// 配置multer临时存储
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: config.upload.LIMITS.FILE_SIZE // 1GB
  },
  fileFilter: (req, file, cb) => {
    // 如果需要验证文件类型，可以在这里添加逻辑
    cb(null, true)
  }
})
// 检查文件是否已存在
router.post(requestBase + '/upload/check', async (req, res) => {
  try {
    const { fileHash, fileName } = req.body
    if (!fileHash) {
      return errorResponse(res, '参数错误：缺少文件哈希值（fileHash）')
    }
    if (!fileName) {
      return errorResponse(res, '参数错误：缺少文件名（fileName）')
    }
    // 检查文件是否已存在
    const fileInfo = await uploadService.getFileInfo(fileName)
    if (fileInfo) {
      // 文件已存在，返回文件信息
      return successResponse(res, {
        exists: true,
        fileUrl: fileInfo.fileUrl,
        fileSize: fileInfo.fileSize
      })
    }
    // 文件不存在，检查已上传的切片
    const uploadedChunks = await uploadService.checkUploadedChunks(fileHash, req.body.totalChunks || 0)
    return successResponse(res, {
      exists: false,
      uploadedChunks
    })
  } catch (error) {
    logger.error('检查文件失败:', { error: error.message })
    return errorResponse(res, '服务器内部错误', 500)
  }
})

// 上传文件切片
router.post(requestBase + '/chunk', upload.single('chunk'), async (req, res) => {
  try {
    const { fileHash, chunkIndex } = req.body
    const chunkFile = req.file
    if (!fileHash) {
      return errorResponse(res, '参数错误：缺少文件哈希值（fileHash）')
    }
    if (chunkIndex === undefined) {
      return errorResponse(res, '参数错误：缺少切片索引（chunkIndex）')
    }
    if (!chunkFile) {
      return errorResponse(res, '文件错误：未上传文件切片（chunk）')
    }
    // 检查文件类型是否允许（如果有type参数）
    if (req.body.type && !(await uploadService.isAllowedFileType(req.body.type))) {
      return errorResponse(res, '不允许的文件类型')
    }
    // 保存文件切片
    await uploadService.saveChunk(fileHash, parseInt(chunkIndex), chunkFile.buffer)
    return successResponse(res, {
      chunkIndex: parseInt(chunkIndex),
      message: '切片上传成功'
    })
  } catch (error) {
    logger.error('上传切片失败:', { error: error.message })
    return errorResponse(res, '服务器内部错误', 500)
  }
})

// 合并文件切片
router.post(requestBase + '/merge', async (req, res) => {
  try {
    const { fileHash, fileName, totalChunks } = req.body
    if (!fileHash) {
      return errorResponse(res, '参数错误：缺少文件哈希值（fileHash）')
    }
    if (!fileName) {
      return errorResponse(res, '参数错误：缺少文件名（fileName）')
    }
    if (totalChunks === undefined) {
      return errorResponse(res, '参数错误：缺少总切片数（totalChunks）')
    }
    // 检查文件类型是否允许
    const fileExtension = fileName.split('.').pop().toLowerCase()
    const mimeType = getMimeType(fileExtension)
    if (mimeType && !(await uploadService.isAllowedFileType(mimeType))) {
      return errorResponse(res, '不允许的文件类型')
    }
    // 合并文件切片
    const result = await uploadService.mergeChunks(fileHash, fileName, parseInt(totalChunks))
    return successResponse(res, {
      fileUrl: result.fileUrl,
      fileSize: result.fileSize,
      message: '文件上传完成'
    })
  } catch (error) {
    logger.error('合并文件失败:', { error: error.message })
    return errorResponse(res, '服务器内部错误', 500)
  }
})

// 获取文件列表
router.get(requestBase + '/list', async (req, res) => {
  try {
    const fs = require('fs-extra')
    const path = require('path')
    const config = require('../config')
    const files = []
    const uploadDir = config.upload.uploadDir
    // 检查上传目录是否存在
    if (!await fs.pathExists(uploadDir)) {
      return successResponse(res, {
        files: []
      })
    }
    // 读取目录中的文件
    const fileNames = await fs.readdir(uploadDir)
    for (const fileName of fileNames) {
      const fileInfo = await uploadService.getFileInfo(fileName)
      if (fileInfo) {
        files.push({
          fileName: fileInfo.fileName,
          fileSize: fileInfo.fileSize,
          lastModified: fileInfo.lastModified,
          fileUrl: fileInfo.fileUrl
        })
      }
    }
    return successResponse(res, {
      files
    })
  } catch (error) {
    logger.error('获取文件列表失败:', { error: error.message })
    return errorResponse(res, '服务器内部错误', 500)
  }
})

// 删除文件
router.delete(requestBase + '/file/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params
    if (!fileName) {
      return errorResponse(res, '缺少文件名参数')
    }

    const result = await uploadService.deleteFile(fileName)

    if (result) {
      return successResponse(res, {
        message: '文件删除成功'
      })
    } else {
      return errorResponse(res, '文件不存在', 404)
    }

  } catch (error) {
    logger.error('删除文件失败:', { error: error.message })
    return errorResponse(res, '服务器内部错误', 500)
  }
})

// 辅助函数：获取文件MIME类型
function getMimeType (extension) {
  const mimeTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'pdf': 'application/pdf',
    'mp4': 'video/mp4',
    'mp3': 'audio/mp3'
    // 可以添加更多的MIME类型
  }

  return mimeTypes[extension] || null
}

module.exports = router
