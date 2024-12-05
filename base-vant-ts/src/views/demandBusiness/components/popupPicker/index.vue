<template lang="pug">
.popup-picker-wrap
  vanPopup(
    ref="popupRef"
    v-model:show="visible"
    :round="round"
    :position="position"
    :close-on-click-overlay="closeOnClickOverlay"
    @click-overlay="onPopupClose"
    @close="onPopupClose"
  )
    vanPicker(
      ref="pickerRef"
      :columns="columns"
      :show-toolbar="showToolbar"
      @confirm="onConfirm"
      @cancel="onPopupClose"
      v-bind="$attrs"
    )
</template>

<script lang="ts">
import type { DictListItem } from '@/api/model'
import type { PickerInstance, PopupInstance } from 'vant'
import { computed, defineComponent, ref, type PropType } from 'vue'

export default defineComponent({
  name: 'PopupPicker',
  props: {
    // 是否显示
    modelValue: {
      type: Boolean,
      default: false
    },
    // 模块数据
    columns: {
      type: Array as PropType<DictListItem[]>,
      default: () => []
    },
    // 	是否显示圆角
    round: {
      type: Boolean,
      default: true
    },
    // 弹出位置，可选值为 top bottom right left
    position: {
      type: String,
      default: 'bottom'
    },
    // 是否允许点击遮罩关闭
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    },
    // 是否显示顶部栏
    showToolbar: {
      type: Boolean,
      default: true
    }
  },
  emits: ['onConfirm', 'update:modelValue', 'onChange'],
  setup(props, { emit }) {
    const popupRef = ref<PopupInstance>()
    const pickerRef = ref<PickerInstance>()
    // 关闭弹出层时立即触发
    const onPopupClose = () => {
      console.log('onPopupClose', props.modelValue, props.columns)
      emit('update:modelValue', false)
    }
    // 点击完成按钮时触发
    const onConfirm = (selectedValues: any, selectedOptions: any, selectedIndexes: number) => {
      emit('onConfirm', selectedValues, selectedOptions, selectedIndexes)
      onPopupClose()
    }
    // 选中的选项改变时触发
    const onChange = (selectedValues: any, selectedOptions: any, selectedIndexes: number, columnIndex: number) => {
      emit('onChange', selectedValues, selectedOptions, selectedIndexes, columnIndex)
    }
    const visible = computed(() => {
      return props.modelValue
    })
    return {
      popupRef,
      pickerRef,
      onPopupClose,
      onConfirm,
      onChange,
      visible
    }
  }
})
</script>

<style lang="stylus" scoped></style>
