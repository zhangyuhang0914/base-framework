<template>
  <div class="file-upload-demo">
    <h2 class="text-xl font-bold mb-6">大文件切片上传演示</h2>
    
    <!-- 文件选择区域 -->
    <div class="upload-area border-2 border-dashed border-gray-300 p-6 rounded-lg mb-6 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all" @click="handleFileSelect">
      <div class="text-center">
        <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p class="text-gray-500">点击选择文件或拖拽文件到此处</p>
        <p class="text-gray-400 text-sm mt-1">支持大文件分片上传，支持暂停/继续和取消</p>
      </div>
    </div>
    
    <!-- 文件信息和上传控制 -->
    <div v-if="selectedFile" class="upload-panel bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h3 class="text-lg font-medium">{{ selectedFile.name }}</h3>
          <p class="text-gray-500 text-sm">{{ formatFileSize(selectedFile.size) }}</p>
        </div>
        
        <div class="flex space-x-2">
          <button 
            v-if="!isUploading" 
            @click="startUpload"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            开始上传
          </button>
          <button 
            v-else-if="isPaused"
            @click="resumeUpload"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            继续上传
          </button>
          <button 
            v-else 
            @click="pauseUpload"
            class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
          >
            暂停上传
          </button>
          <button 
            @click="cancelUpload"
            class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            取消上传
          </button>
        </div>
      </div>
      
      <!-- 上传进度条 -->
      <div class="mb-2">
        <div class="flex justify-between mb-1">
          <span class="text-sm text-gray-600">上传进度</span>
          <span class="text-sm font-medium">{{ uploadProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            class="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
            :style="{ width: uploadProgress + '%' }"
          ></div>
        </div>
      </div>
      
      <!-- 上传状态信息 -->
      <div class="mt-4 text-sm text-gray-600">
        <p v-if="uploadStatus">当前状态：{{ uploadStatus }}</p>
        <p v-if="currentChunkIndex !== null">正在上传分片：{{ currentChunkIndex + 1 }}/{{ totalChunks }}</p>
        <p v-if="uploadedFileUrl" class="text-green-600 mt-2">
          上传成功！文件地址：<a :href="uploadedFileUrl" target="_blank" class="underline">{{ uploadedFileUrl }}</a>
        </p>
      </div>
    </div>
    
    <!-- 已上传文件列表 -->
    <div v-if="uploadedFiles.length > 0" class="mt-8">
      <h3 class="text-lg font-medium mb-4">已上传文件</h3>
      <div class="bg-white rounded-lg shadow p-4">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-2 px-4 font-medium text-gray-500">文件名</th>
              <th class="text-left py-2 px-4 font-medium text-gray-500">大小</th>
              <th class="text-left py-2 px-4 font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="file in uploadedFiles" :key="file.fileName" class="border-b border-gray-200">
              <td class="py-2 px-4">{{ file.fileName }}</td>
              <td class="py-2 px-4">{{ formatFileSize(file.fileSize) }}</td>
              <td class="py-2 px-4">
                <a :href="file.fileUrl" target="_blank" class="text-blue-600 hover:underline mr-4">查看</a>
                <button @click="handleDeleteFile(file.fileName)" class="text-red-600 hover:text-red-800">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="FileUploadDemo">
import { ref, computed } from 'vue';
import type { UploadChunkParams, MergeChunksParams, CheckFileResult } from '@/api/interface/upload';
import { checkFileExists, uploadChunk, mergeChunks, cancelUpload as apiCancelUpload, getFileList, deleteFile } from '@/api/helper/upload';

// 状态定义
const selectedFile = ref<File | null>(null);
const fileHash = ref<string>('');
const uploadProgress = ref<number>(0);
const isUploading = ref<boolean>(false);
const isPaused = ref<boolean>(false);
const currentChunkIndex = ref<number | null>(null);
const totalChunks = ref<number>(0);
const uploadStatus = ref<string>('');
const uploadedFileUrl = ref<string>('');
const uploadedFiles = ref<any[]>([]);
const uploadAbortController = ref<AbortController | null>(null);

// 配置项
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB 分片大小

// 处理文件选择
const handleFileSelect = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      selectedFile.value = file;
      // 重置上传状态
      resetUploadState();
      // 计算文件哈希（模拟实现）
      computeFileHash(file).then(hash => {
        fileHash.value = hash;
      });
    }
  };
  input.click();
};

// 计算文件哈希（简单实现，实际项目中可以使用crypto库）
const computeFileHash = async (file: File): Promise<string> => {
  // 这里使用简单的哈希计算方式，实际项目中可以使用更复杂的算法
  // 例如：MD5、SHA1等
  return `${file.name}-${file.size}-${file.lastModified}`;
};

// 重置上传状态
const resetUploadState = () => {
  uploadProgress.value = 0;
  isUploading.value = false;
  isPaused.value = false;
  currentChunkIndex.value = null;
  totalChunks.value = 0;
  uploadStatus.value = '';
  uploadedFileUrl.value = '';
  uploadAbortController.value = null;
};

// 开始上传
const startUpload = async () => {
  if (!selectedFile.value || !fileHash.value) return;

  isUploading.value = true;
  isPaused.value = false;
  uploadAbortController.value = new AbortController();
  uploadStatus.value = '正在准备上传...';

  try {
    // 1. 检查文件是否已存在或部分上传
    const checkResult = await checkFileExists(fileHash.value, selectedFile.value.name);
    
    if (checkResult.data.exists && checkResult.data.fileUrl) {
      uploadStatus.value = '文件已存在';
      uploadedFileUrl.value = checkResult.data.fileUrl;
      isUploading.value = false;
      return;
    }

    // 2. 计算分片数量
    totalChunks.value = Math.ceil(selectedFile.value.size / CHUNK_SIZE);
    const uploadedChunkIndexes = checkResult.data.uploadedChunks || [];
    
    // 3. 上传未上传的分片
    const chunksToUpload = [];
    for (let i = 0; i < totalChunks.value; i++) {
      if (!uploadedChunkIndexes.includes(i)) {
        chunksToUpload.push(i);
      }
    }
    
    // 更新进度
    if (uploadedChunkIndexes.length > 0) {
      uploadProgress.value = Math.round((uploadedChunkIndexes.length / totalChunks.value) * 100);
    }

    // 4. 依次上传分片
    for (let i = 0; i < chunksToUpload.length; i++) {
      if (isPaused.value || !isUploading.value) {
        break;
      }
      
      const chunkIndex = chunksToUpload[i];
      currentChunkIndex.value = chunkIndex;
      uploadStatus.value = `正在上传分片 ${chunkIndex + 1}/${totalChunks.value}`;
      
      await uploadSingleChunk(chunkIndex);
      
      // 更新整体进度
      const uploadedCount = uploadedChunkIndexes.length + i + 1;
      uploadProgress.value = Math.round((uploadedCount / totalChunks.value) * 100);
    }

    // 5. 如果所有分片都已上传，合并文件
    if (isUploading.value && !isPaused.value) {
      uploadStatus.value = '正在合并文件...';
      await mergeFile();
    }
  } catch (error) {
    console.error('上传失败:', error);
    uploadStatus.value = '上传失败，请重试';
    isUploading.value = false;
  }
};

// 上传单个分片
const uploadSingleChunk = async (chunkIndex: number) => {
  if (!selectedFile.value || !fileHash.value || !uploadAbortController.value) return;

  const start = chunkIndex * CHUNK_SIZE;
  const end = Math.min(start + CHUNK_SIZE, selectedFile.value.size);
  const chunk = selectedFile.value.slice(start, end);

  const params: UploadChunkParams = {
    fileHash: fileHash.value,
    chunkIndex,
    chunkSize: CHUNK_SIZE,
    totalChunks: totalChunks.value,
    fileName: selectedFile.value.name,
    fileSize: selectedFile.value.size
  };

  try {
    await uploadChunk(params, chunk);
  } catch (error) {
    console.error(`分片 ${chunkIndex} 上传失败:`, error);
    throw error;
  }
};

// 合并文件
const mergeFile = async () => {
  if (!selectedFile.value || !fileHash.value) return;

  const params: MergeChunksParams = {
    fileHash: fileHash.value,
    fileName: selectedFile.value.name,
    fileSize: selectedFile.value.size,
    totalChunks: totalChunks.value
  };

  try {
    const result = await mergeChunks(params);
    if (result.data.success && result.data.fileUrl) {
      uploadedFileUrl.value = result.data.fileUrl;
      uploadStatus.value = '文件上传成功！';
      isUploading.value = false;
      // 获取更新后的文件列表
      fetchUploadedFiles();
    } else {
      throw new Error(result.data.message || '文件合并失败');
    }
  } catch (error) {
    console.error('文件合并失败:', error);
    throw error;
  }
};

// 暂停上传
const pauseUpload = () => {
  isPaused.value = true;
  uploadStatus.value = '上传已暂停';
};

// 继续上传
const resumeUpload = () => {
  if (!isPaused.value) return;
  
  isPaused.value = false;
  startUpload();
};

// 取消上传
const cancelUpload = async () => {
  if (!fileHash.value || !isUploading.value) {
    resetUploadState();
    return;
  }

  try {
    // 调用API取消上传
    await apiCancelUpload(fileHash.value);
    // 中止正在进行的请求
    if (uploadAbortController.value) {
      uploadAbortController.value.abort();
    }
    resetUploadState();
    uploadStatus.value = '上传已取消';
  } catch (error) {
    console.error('取消上传失败:', error);
    resetUploadState();
  }
};

// 获取已上传文件列表
const fetchUploadedFiles = async () => {
  try {
    const result = await getFileList();
    if (result.data.files) {
      uploadedFiles.value = result.data.files;
    }
  } catch (error) {
    console.error('获取文件列表失败:', error);
  }
};

// 删除文件
const handleDeleteFile = async (fileName: string) => {
  try {
    await deleteFile(fileName);
    // 重新获取文件列表
    fetchUploadedFiles();
  } catch (error) {
    console.error('删除文件失败:', error);
  }
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 组件挂载时获取文件列表
fetchUploadedFiles();
</script>

<style scoped>
.file-upload-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.upload-area {
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #3b82f6;
  background-color: #f0f9ff;
}

.upload-panel {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
