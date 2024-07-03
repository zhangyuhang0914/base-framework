<template lang="pug">
.attachmentContent
  .attachmentTitle(v-if='showAttachmentTitle') {{attachmentTitle}}
  .attachmentItem(v-for='aItem in attachmentList' :key='aItem.id')
    up-link(
      :text='aItem.fileOriginalName'
      :under-line="true"
      :href='download(aItem.id, aItem.fileExtSuffix)'
      @click='handleDownload(aItem)')
</template>

<script setup lang="ts">
import { download } from '@/api/common'
import type { AttachmentItem } from '@/api/common/types'
import { handleDownloadFile, getImageExtension } from '@/util/utils'
const props = defineProps({
  // 附件标题
  attachmentTitle: {
    type: String,
    default: '附件：'
  },
  // 是否展示附件标题
  showAttachmentTitle: {
    type: Boolean,
    default: true
  },
  // 附件列表
  attachmentList: {
    type: Array,
    default() {
      return []
    }
  }
})

const handleDownload = (item: AttachmentItem) => {
  let url = download(item.id, item.fileExtSuffix)
  let isImg = getImageExtension(item.fileOriginalName)
  let fileType = item.fileExtSuffix.replaceAll('.', '')
  handleDownloadFile(url, isImg, fileType)
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
