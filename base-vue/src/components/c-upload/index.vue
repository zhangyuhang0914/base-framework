<template lang="pug">
.uploader-content(@click="handleClick") {{ '附件上传' }}
  input.uploader-target(ref="inputRef" type="file" :name="name" :multiple="multiple" :accept="accept" @change="handleChange")
</template>

<script setup name="c-update">
import { shallowRef } from 'vue'
const props = defineProps({
  name: {
    type: String,
    default: 'c-update'
  },
  multiple: {
    type: Number,
    default: 9
  },
  accept: {
    type: String,
    default: '*'
  }
})
const inputRef = shallowRef(null)
const handleClick = () => {
  inputRef.value.value = ''
  inputRef.value?.click()
}
const handleChange = e => {
  const files = e.target.files
  if (!files) return
  // 获取到文件后调用附件上传方法
  uploadFiles(files)
}
const uploadFiles = files => {
  console.log('files', files)
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
