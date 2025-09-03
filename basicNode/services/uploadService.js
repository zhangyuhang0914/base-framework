// 上传服务
const fs = require('fs-extra')
const path = require('path')
const config = require('../config')
const logger = require('../utils/logger')

class UploadService {
  constructor() {
    this.tempDir = config.upload.tempDir
    this.uploadDir = config.upload.uploadDir
  }
  // 检查文件类型是否允许
  // allowedTypes为空数组时表示允许所有文件类型
  async isAllowedFileType (fileType) {
    // 如果allowedTypes为空数组，则允许所有文件类型
    if (config.upload.allowedTypes.length === 0) {
      return true
    }
    return config.upload.allowedTypes.includes(fileType)
  }
  // 创建文件临时目录
  async createTempDir (fileHash) {
    const dirPath = path.join(this.tempDir, fileHash)
    try {
      // 确保临时目录存在
      await fs.ensureDir(dirPath)
      return dirPath
    } catch (error) {
      logger.error('创建临时目录失败:', { fileHash, error })
      throw new Error('创建临时目录失败')
    }
  }
  // 保存文件切片
  async saveChunk (fileHash, chunkIndex, fileStream) {
    try {
      // 验证参数
      if (!fileHash || chunkIndex === undefined || !fileStream) {
        throw new Error('保存切片失败：缺少必要参数（fileHash、chunkIndex或fileStream）')
      }

      const tempDir = await this.createTempDir(fileHash)
      const chunkPath = path.join(tempDir, `${chunkIndex}`)
      // 保存文件切片
      const writeStream = fs.createWriteStream(chunkPath)
      return new Promise((resolve, reject) => {
        fileStream.pipe(writeStream)
        writeStream.on('finish', () => {
          logger.info('文件切片保存成功:', { fileHash, chunkIndex })
          resolve({ success: true, chunkPath })
        })
        writeStream.on('error', (error) => {
          logger.error('文件切片保存失败:', { fileHash, chunkIndex, error })
          reject(new Error(`保存切片 ${chunkIndex} 失败：${error.message}`))
        })
      })
    } catch (error) {
      logger.error('保存文件切片时出错:', { fileHash, chunkIndex, error })
      throw error
    }
  }
  // 检查已上传的切片
  async checkUploadedChunks (fileHash, totalChunks) {
    try {
      const tempDir = path.join(this.tempDir, fileHash)
      const exists = await fs.pathExists(tempDir)
      if (!exists) {
        return []
      }
      const files = await fs.readdir(tempDir)
      const uploadedChunks = files
        .filter(file => !isNaN(parseInt(file)))
        .map(file => parseInt(file))
      return uploadedChunks
    } catch (error) {
      logger.error('检查已上传切片失败:', { fileHash, error })
      return []
    }
  }
  // 合并文件切片
  async mergeChunks (fileHash, fileName, totalChunks) {
    try {
      // 验证参数
      if (!fileHash || !fileName || totalChunks === undefined) {
        throw new Error('合并文件失败：缺少必要参数（fileHash、fileName或totalChunks）')
      }
      const tempDir = path.join(this.tempDir, fileHash)
      const targetPath = path.join(this.uploadDir, fileName)
      // 确保目标目录存在
      await fs.ensureDir(this.uploadDir)
      // 创建目标文件
      const writeStream = fs.createWriteStream(targetPath)
      // 按顺序合并切片
      for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join(tempDir, `${i}`)
        // 检查切片是否存在
        if (!(await fs.pathExists(chunkPath))) {
          throw new Error(`合并失败：切片 ${i} 不存在，请重新上传该切片`)
        }
        // 读取切片内容并写入目标文件
        const chunkContent = await fs.readFile(chunkPath)
        await new Promise((resolve, reject) => {
          writeStream.write(chunkContent, (err) => {
            if (err) reject(err)
            else resolve()
          })
        })
        // 删除已合并的切片
        await fs.remove(chunkPath)
      }
      // 关闭写入流
      await new Promise((resolve, reject) => {
        writeStream.end((err) => {
          if (err) reject(err)
          else resolve()
        })
      })
      // 删除临时目录
      await fs.remove(tempDir)
      logger.info('文件合并成功:', { fileHash, fileName, totalChunks })
      // 返回文件信息
      const stats = await fs.stat(targetPath)
      return {
        success: true,
        fileUrl: `/uploads/files/${fileName}`,
        filePath: targetPath,
        fileSize: stats.size
      }
    } catch (error) {
      logger.error('文件合并失败:', { fileHash, fileName, error })
      throw error
    }
  }
  // 上传完成后的清理工作
  async cleanupUpload (fileHash) {
    try {
      const tempDir = path.join(this.tempDir, fileHash)
      if (await fs.pathExists(tempDir)) {
        await fs.remove(tempDir)
        logger.info('上传临时文件已清理:', { fileHash })
      }
    } catch (error) {
      logger.error('清理上传文件失败:', { fileHash, error })
    }
  }
  // 获取文件信息
  async getFileInfo (fileName) {
    try {
      const filePath = path.join(this.uploadDir, fileName)
      const exists = await fs.pathExists(filePath)
      if (!exists) {
        return null
      }
      const stats = await fs.stat(filePath)
      return {
        fileName,
        filePath,
        fileSize: stats.size,
        lastModified: stats.mtime,
        fileUrl: `/uploads/files/${fileName}`
      }
    } catch (error) {
      logger.error('获取文件信息失败:', { fileName, error })
      return null
    }
  }

  // 删除文件
  async deleteFile (fileName) {
    try {
      const filePath = path.join(this.uploadDir, fileName)
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath)
        logger.info('文件已删除:', { fileName })
        return true
      }
      return false
    } catch (error) {
      logger.error('删除文件失败:', { fileName, error })
      return false
    }
  }
}

module.exports = new UploadService()
