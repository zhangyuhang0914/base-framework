<template lang="pug">
.page-view
  web-view.iframe(ref="webView" :src="url" @load="onWebviewLoad" @error="onWebviewError")
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { loading } from '@/common/uni-utils'

export default defineComponent({
  name: 'WebView',
  setup() {
    const webView = ref<HTMLIFrameElement>()
    const url = ref('')
    const title = ref('')
    const onWebviewLoad = () => {
      loading.hide()
    }
    const onWebviewError = () => {
      loading.hide()
    }
    onLoad((options: AnyObject | undefined) => {
      loading.show()
      url.value = options?.url ?? ''
      title.value = options?.title ?? ''
      if (title.value) {
        uni.setNavigationBarTitle({
          title: title.value
        })
      }
    })
    return {
      webView,
      url,
      onWebviewLoad,
      onWebviewError
    }
  }
})
</script>

<style lang="stylus" scoped></style>
