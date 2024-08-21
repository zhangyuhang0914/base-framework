<template lang="pug">
.c-upload
  ElUpload(
    ref="uploadRef"
    v-model="fileList"
    :accept="accept"
    :limit="limit"
    :multiple="multiple"
    :list-type="listType"
    :show-file-list="showFileList"
    :disabled="disabled"
    :on-preview="onPreview"
    :on-remove="onRemove"
    :on-success="onSuccess"
    :on-error="onError"
    :on-progress="onProgress"
    :on-change="onchange"
    :on-exceed="onExceed"
    :before-upload="beforeUpload"
    :before-remove="beforeRemove"
    :http-request="uploadAction"
  ).custom-upload
    template(#default)
      ElLink(type="primary" :underline="false")
        slot(name="content")
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { genFileId, type UploadFile, type UploadFiles, type UploadInstance, type UploadRawFile, type UploadRequestOptions, type UploadUserFile } from 'element-plus'
import { uploadFile } from '@/apis/common'
import { $message } from '@/plugins/element'

export default defineComponent({
  name: 'CUpload',
  props: {
    // 已上传文件列表
    fileList: {
      type: Array,
      default: () => []
    },
    // 已上传文件展示格式
    listType: {
      type: String,
      default: 'text'
    },
    // 上传的文件类型限制
    accept: {
      type: String,
      default: 'image/*'
    },
    // 上传的文件数量限制
    limit: {
      type: Number,
      default: 1
    },
    // 文件大小限制 默认 5MB
    size: {
      type: Number,
      default: 1024 * 1024 * 5
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:fileList', 'onPreview', 'onRemove', 'onSuccess', 'onError', 'onProgress', 'onchange', 'onExceed', 'beforeUpload', 'beforeRemove'],
  setup(props, { emit, expose }) {
    const uploadRef = ref<UploadInstance | null>()
    // 取消上传
    const abort = (file: UploadFile) => {
      uploadRef.value?.abort(file)
    }
    // 清空上传列表
    const clearFiles = () => {
      uploadRef.value?.clearFiles()
    }
    // 点击文件列表中已上传的文件时的钩子
    const onPreview = (uploadFile: UploadFiles) => {
      emit('onPreview', uploadFile)
    }
    // 文件列表移除文件时的钩子
    const onRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
      props.multiple ? emit('onRemove', uploadFiles) : emit('onRemove', uploadFile)
    }
    // 文件上传成功时的钩子
    const onSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
      emit('update:fileList', uploadFiles)
      emit('onSuccess', response, uploadFile, uploadFiles)
    }
    // 文件上传失败时的钩子
    const onError = (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
      emit('onError', error, uploadFile, uploadFiles)
    }
    // 文件上传时的钩子
    const onProgress = (event: ProgressEvent, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
      emit('onProgress', event, uploadFile, uploadFiles)
    }
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    const onchange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
      emit('onchange', uploadFile, uploadFiles)
    }
    // 当超出限制时，执行的钩子函数
    const onExceed = (files: File[], uploadFiles: UploadUserFile[]) => {
      // 覆盖上传
      if (props.limit === 1) {
        if (!beforeUpload(files[0] as UploadRawFile)) return
        uploadRef.value?.clearFiles()
        const file = files[0] as UploadRawFile
        file.uid = genFileId()
        uploadRef.value!.handleStart(file)
        uploadRef.value?.submit()
      } else {
        $message(`最多只能上传 ${props.limit} 个文件！`, 'error')
      }
      emit('onExceed', files)
    }
    // 解析 accept 属性
    const parseAccept = (accept: string) => {
      const types = accept.split(',').map(type => type.trim().toLowerCase())
      const extensions = types.filter(type => type.startsWith('.')).map(ext => ext.slice(1))
      const mimeTypes = types.filter(type => !type.startsWith('.'))
      return { extensions, mimeTypes }
    }
    // 获取文件 MIME 类型
    const getFileMimeType = (file: File) => {
      return file.type ? file.type.toLowerCase() : ''
    }
    // 检查文件类型
    const checkFileType = (rawFile: UploadRawFile) => {
      // extensions: 扩展名类型    mimeTypes: MIME 类型
      const { extensions, mimeTypes } = parseAccept(props.accept)
      const fileExtension = rawFile.name.split('.').pop()?.toLowerCase() || ''
      const fileMimeType = getFileMimeType(rawFile)
      // 检查扩展名
      const isExtensionAccepted = extensions.includes(fileExtension)
      // 检查 MIME 类型
      const isMimeTypeAccepted = mimeTypes.includes(fileMimeType) || mimeTypes.some(mime => mime.endsWith('/*') && fileMimeType.startsWith(mime.split('/')[0] + '/'))
      return { isExtensionAccepted, isMimeTypeAccepted }
    }
    // 上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。
    const beforeUpload = (rawFile: UploadRawFile) => {
      // isExtensionAccepted: 是否通过扩展名类型检查  isMimeTypeAccepted: 是否通过 MIME 类型检查
      const { isExtensionAccepted, isMimeTypeAccepted } = checkFileType(rawFile)
      // 文件类型检查
      if (!isMimeTypeAccepted && !isExtensionAccepted) {
        $message(`文件类型不正确，请上传 ${props.accept} 类型的文件！`, 'error')
        return false
      }
      // 文件大小检查
      if (rawFile.size > props.size) {
        $message(`文件大小不能超过 ${props.size / 1024 / 1024}MB！`, 'error')
        return false
      }
      return true
    }
    // 删除文件之前的钩子，参数为上传的文件和文件列表， 若返回 false 或者返回 Promise 且被 reject，则停止删除。
    const beforeRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
      props.multiple ? emit('beforeRemove', uploadFiles) : emit('beforeRemove', uploadFile)
      return true
    }
    // 自定义上传请求
    const uploadAction = (options: UploadRequestOptions): Promise<any> => {
      const params = {
        withCredentials: options.withCredentials,
        file: options.file,
        fileName: options.filename
      }
      return uploadFile(params)
    }
    expose({ abort, clearFiles })
    onMounted(() => {})
    return {
      uploadRef,
      onPreview,
      onRemove,
      onSuccess,
      onError,
      onProgress,
      onchange,
      onExceed,
      beforeUpload,
      beforeRemove,
      uploadAction
    }
  }
})
</script>

<style lang="stylus" scoped></style>
