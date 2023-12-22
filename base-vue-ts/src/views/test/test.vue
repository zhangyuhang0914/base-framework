<template lang="pug">
.page-wrap
  .test-select
    CSelect(
      @change="selectChange"
      @visible-change="visibleChange"
      @remove-tag="removeTagChange"
      @clear="clearChange"
      @blur="blurChange"
      @focus="focusChange"
    )
      template(#default)
        span 111
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CSelect from '@/components/c-select/index.vue'
export default defineComponent({
  name: 'Test',
  components: { CSelect },
  props: {
    width: {
      type: String || Number,
      default: '100%'
    }
  },
  setup(props, context) {
    const selectChange = (val: any) => {
      console.log('selectChange', val)
    }
    const visibleChange = (val: boolean) => {
      console.log('visibleChange', val)
    }
    const removeTagChange = (val: any) => {
      console.log('removeTagChange', val)
    }
    const clearChange = () => {
      console.log('clearChange')
    }
    const blurChange = (event: Event) => {
      console.log('blurChange', event)
    }
    const focusChange = (event: Event) => {
      console.log('focusChange', event)
    }
    onMounted(() => {
      console.log('onMounted')
    })
    return {
      selectChange,
      visibleChange,
      removeTagChange,
      clearChange,
      blurChange,
      focusChange
    }
  }
})
</script>

<style lang="stylus" scoped>
.test-select
  display flex
  align-items center
  justify-content center
  .page-wrap
    width 50%
</style>
