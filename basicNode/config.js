// 配置文件
module.exports = {
  // 服务器配置
  server: {
    port: 8087,
    // host: 'localhost'
    host: '0.0.0.0' // ip地址
  },
  // API配置
  api: {
    // 基础服务接口前缀
    baseServer: '/baseServer',
    // 文件服务接口前缀
    fileServer: '/fileServer'
  },
  // 文件上传配置
  upload: {
    // 临时文件存储目录
    tempDir: './uploads/temp',
    // 最终文件存储目录
    uploadDir: './uploads/files',
    // 允许的文件类型 - 空数组表示允许所有文件类型
    allowedTypes: [],
    // 常量配置
    LIMITS: {
      FILE_SIZE: 1024 * 1024 * 1024, // 文件大小限制 (1GB)
      CHUNK_SIZE: 10 * 1024 * 1024, // 切片大小 (10MB)
      MAX_CHUNKS: 1000 // 最大切片数量
    }
  },
  // 日志配置
  logger: {
    level: 'info',
    directory: './logs'
  }
}
