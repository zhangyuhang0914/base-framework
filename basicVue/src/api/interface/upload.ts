/**
 * 文件上传相关类型定义
 */

// 上传相关类型定义
export interface UploadChunkParams {
  fileHash: string // 文件唯一标识
  chunkIndex: number // 切片索引
  chunkSize: number // 切片大小
  totalChunks: number // 总切片数
  fileName: string // 文件名
  fileSize: number // 文件大小
}

export interface UploadChunkResult {
  success: boolean
  chunkIndex: number
  uploadId?: string
  message?: string
}

export interface MergeChunksParams {
  fileHash: string
  fileName: string
  fileSize: number
  totalChunks: number
}

export interface MergeChunksResult {
  success: boolean
  fileUrl?: string
  message?: string
}

export interface CheckFileResult {
  exists: boolean
  uploadedChunks: number[]
  fileUrl?: string
}