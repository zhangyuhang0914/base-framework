<template lang="pug">
.page-wrap
  .entry-main
    .entry-content
      .entry-title {{ '千企万户大走访' }}
      .operation-btn
        vanButton.custom-primary-btn(v-for="(item, index) in operationBtn" :key="index" :type="item.type" @click="handlerOperation(item.path)")
          img(:src="item.icon" alt="加载失败")
          span {{ item.text }}
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

interface OperationBtnType {
  text: string
  type: string
  icon: string
  path: string
}
export default defineComponent({
  name: 'Entry',
  setup(props) {
    const { VITE_APP_IMG_URL } = import.meta.env
    const operationBtn: OperationBtnType[] = reactive([
      {
        text: '企业需求申报',
        type: 'default',
        icon: VITE_APP_IMG_URL + 'entry/enterpriseApply.png',
        path: 'enterpriseApply'
      },
      {
        text: '我的申报清单',
        type: 'default',
        icon: VITE_APP_IMG_URL + 'entry/applyRecord.png',
        path: 'applyRecord'
      }
    ])
    const handlerOperation = (path: string) => {
      console.log('handlerOperation', path)
    }
    return {
      operationBtn,
      handlerOperation
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
