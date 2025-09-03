/**
 * 文件上传相关 API
 * 大文件切片上传、暂停/继续、取消上传等功能
 */

import { post, get } from '@/common/http/index'
import type {
  UploadChunkParams,
  UploadChunkResult,
  MergeChunksParams,
  MergeChunksResult,
  CheckFileResult
} from '@/api/interface/upload'
import type { httpRequestConfig } from '@/common/interface/http'

/**
 * 检查文件是否已存在或部分上传
 * @param fileHash 文件唯一标识
 * @param fileName 文件名
 */
export function checkFileExists(fileHash: string, fileName: string) {
  const param: httpRequestConfig = {
    apiType: 'FILE',
    url: '/upload/check',
    data: {
      fileHash,
      fileName
    }
  }
  return post<CheckFileResult>(param)
}

/**
 * 上传单个文件切片
 * @param params 上传参数
 * @param chunk 切片数据
 */
export function uploadChunk(params: UploadChunkParams, chunk: Blob) {
  const formData = new FormData()
  // 添加参数
  Object.entries(params).forEach(([key, value]) => {
    formData.append(key, String(value))
  })
  // 添加文件切片
  formData.append('chunk', chunk)
  const param: httpRequestConfig = {
    apiType: 'FILE',
    url: '/upload/chunk',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    // 支持上传进度监听
    onUploadProgress: (progressEvent: ProgressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      console.log(`Chunk ${params.chunkIndex} upload progress: ${percentCompleted}%`)
    }
  }
  return post<UploadChunkResult>(param)
}

/**
 * 合并文件切片
 * @param params 合并参数
 */
export function mergeChunks(params: MergeChunksParams) {
  const param: httpRequestConfig = {
    apiType: 'FILE',
    url: '/upload/merge',
    data: params
  }
  return post<MergeChunksResult>(param)
}

/**
 * 取消上传任务
 * @param fileHash 文件唯一标识
 */
export function cancelUpload(fileHash: string) {
  const param: httpRequestConfig = {
    apiType: 'FILE',
    url: '/upload/cancel',
    data: fileHash
  }
  return post(param)
}

/**
 * 获取已上传文件列表
 */
export function getFileList() {
  const param: httpRequestConfig = {
    apiType: 'FILE',
    url: '/list'
  }
  return get(param)
}

/**
 * 删除文件
 * @param fileName 文件名
 */
export function deleteFile(fileName: string) {
  const param: httpRequestConfig = {
    apiType: 'FILE',
    url: `/upload/file/${fileName}`
  }
  return get(param)
}
