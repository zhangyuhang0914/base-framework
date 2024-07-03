<template lang="pug">
.c-column-select(@click="selectHandle")
  u-input(v-model="modelValue" border="none" readonly :placeholder="placeholder")
    template(#suffix)
      slot(name="right")
        span.suffix-right {{ '选择' }}
up-picker(:show="show" :columns="[columns]" :keyName="keyName" closeOnClickOverlay @confirm="confirm" @cancel="cancel" @close="close")
</template>

<script lang="ts">
import { defineComponent, type Ref, ref } from 'vue'

export default defineComponent({
  name: 'CPicker',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      default: () => []
    },
    keyName: {
      type: String,
      default: 'name'
    }
  },
  emits: ['confirm', 'cancel', 'close'],
  setup(props, context) {
    const show: Ref<boolean> = ref(false)
    const selectHandle = () => {
      init()
    }
    const init = () => {
      show.value = true
    }
    const confirm = <T,>(values: Array<T>) => {
      show.value = false
      context.emit('confirm', values)
    }
    const cancel = () => {
      show.value = false
      context.emit('cancel')
    }
    const close = () => {
      show.value = false
      context.emit('close')
    }
    context.expose({ init })
    return {
      show,
      selectHandle,
      confirm,
      cancel,
      close
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
