<template lang="pug">
view.uploadBox
  img.previewImg(v-if="fileId" :src="preview(fileId)" @click='handlePreview')
  view.uploadBtn(@click='handleUpload')
    up-icon(:name="fileId ? 'edit-pen':'plus'" color='#dadde7')
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { upload, preview } from '@/api/common'
import { toast } from '@/common/uni-utils'
const $emit = defineEmits(['onChooseImage'])
let fileId = ref('')
let tempFilePaths = ref()
// 上传图片
const handleUpload = () => {
  uni.chooseImage({
    count: 1,
    success: (chooseImageRes: AnyObject) => {
      tempFilePaths.value = chooseImageRes.tempFilePaths
      upload(tempFilePaths.value[0]).then(value => {
        let data = value.data.length ? value.data[0] : {}
        fileId.value = data.id
        $emit('onChooseImage', fileId.value)
      })
    }
  })
}
// 预览图片
const handlePreview = () => {
  uni.previewImage({
    urls: tempFilePaths.value,
    success: function (res) {
      console.log('图片预览成功')
    },
    fail: () => {
      toast.show('图片预览失败', 'none', 3000)
    }
  })
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
