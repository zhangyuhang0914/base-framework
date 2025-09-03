# Express 大文件切片上传服务

这是一个基于 Express 的大文件切片上传服务，支持文件分片上传、断点续传、文件合并等功能，可用于大型企业项目开发。

## 功能特性

- ✅ 大文件切片上传
- ✅ 断点续传
- ✅ 文件类型检查
- ✅ 文件大小限制
- ✅ 完整的错误处理机制
- ✅ 详细的日志记录
- ✅ 支持 CORS 跨域
- ✅ 支持 JSON 请求体解析

## 项目结构

```
├── app.js              # 主入口文件
├── config.js           # 配置文件
├── routes/             # 路由文件夹
│   └── upload.js       # 上传相关路由
├── services/           # 服务层
│   └── uploadService.js # 上传服务实现
├── utils/              # 工具函数
│   └── logger.js       # 日志工具
├── middlewares/        # 中间件
│   └── errorHandler.js # 错误处理中间件
├── uploads/            # 上传文件存储目录
│   ├── temp/           # 临时文件目录
│   └── files/          # 最终文件存储目录
├── logs/               # 日志文件目录
├── package.json        # 项目依赖
└── .gitignore          # Git 忽略文件
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动服务

```bash
npm start
```

开发环境启动（支持热重载）：

```bash
npm run dev
```

## API 接口文档

### 1. 检查文件是否已上传或获取已上传的切片

**请求URL**: `/api/upload/check`
**请求方法**: POST
**请求体**: 
```json
{
  "fileHash": "文件唯一标识",
  "fileName": "文件名",
  "totalChunks": 总切片数（可选）
}
```
**响应**: 
```json
{
  "code": 200,
  "success": true,
  "exists": true/false, // 文件是否已完整上传
  "fileUrl": "文件URL", // 如果文件已存在，返回文件URL
  "fileSize": 文件大小, // 如果文件已存在，返回文件大小
  "uploadedChunks": [0, 1, 2] // 已上传的切片索引数组
}
```

### 2. 上传文件切片

**请求URL**: `/api/upload/chunk`
**请求方法**: POST
**请求体**: multipart/form-data
- `fileHash`: 文件唯一标识
- `chunkIndex`: 切片索引
- `chunk`: 文件切片二进制数据
- `type`: 文件类型（可选）

**响应**: 
```json
{
  "code": 200,
  "success": true,
  "message": "切片上传成功",
  "chunkIndex": 上传的切片索引
}
```

### 3. 合并文件切片

**请求URL**: `/api/upload/merge`
**请求方法**: POST
**请求体**: 
```json
{
  "fileHash": "文件唯一标识",
  "fileName": "文件名",
  "totalChunks": 总切片数
}
```
**响应**: 
```json
{
  "code": 200,
  "success": true,
  "message": "文件上传完成",
  "data": {
    "fileUrl": "文件访问URL",
    "fileSize": 文件大小
  }
}
```

### 4. 获取文件列表

**请求URL**: `/api/upload/list`
**请求方法**: GET
**响应**: 
```json
{
  "code": 200,
  "success": true,
  "files": [
    {
      "fileName": "文件名",
      "fileSize": 文件大小,
      "lastModified": "最后修改时间",
      "fileUrl": "文件访问URL"
    }
  ]
}
```

### 5. 删除文件

**请求URL**: `/api/upload/file/:fileName`
**请求方法**: DELETE
**响应**: 
```json
{
  "code": 200,
  "success": true,
  "message": "文件删除成功"
}
```

### 6. 健康检查

**请求URL**: `/health`
**请求方法**: GET
**响应**: 
```json
{
  "status": "ok",
  "timestamp": "当前时间戳"
}
```

## 配置说明

配置文件位于 `config.js`，可以根据需要修改以下配置：

- **server**: 服务器配置（端口、主机）
- **upload**: 上传相关配置（临时目录、上传目录、允许的文件类型、文件大小限制、切片大小）
- **logger**: 日志配置（日志级别、日志目录）

## 技术栈

- Node.js
- Express
- body-parser
- multer
- fs-extra

## 前端集成建议

前端可以通过以下步骤与本服务集成：

1. 计算文件的唯一哈希值（如 MD5）
2. 检查文件是否已上传或部分上传
3. 对未上传的切片进行上传
4. 所有切片上传完成后，请求合并文件

## 注意事项

- 确保 `uploads` 和 `logs` 目录具有写入权限
- 生产环境建议配置环境变量来覆盖默认配置
- 可以根据实际需求扩展文件类型和大小限制
- 对于高并发场景，建议考虑使用分布式文件存储