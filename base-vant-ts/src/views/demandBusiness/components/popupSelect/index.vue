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
    //- 选择器
    vanPicker(
      v-if="type === 'picker'"
      ref="pickerRef"
      :title="title"
      :columns="columns"
      :show-toolbar="showToolbar"
      @confirm="onPickerConfirm"
      @cancel="onPopupClose"
      v-bind="$attrs"
    )
    //- 联级选择器
    vanCascader(
      v-if="type === 'cascader'"
      v-model="visible"
      :title="title"
      :options="columns"
      active-color="#F6D687"
      :swipeable="swipeable"
      :closeable="closeable"
      @close="onPopupClose"
      @change="onCascaderChange"
      @finish="onCascaderFinish"
      @click-tab="onPopupClose"
    )
</template>

<script lang="ts">
import type { DictListItem } from '@/api/model'
import type { CascaderOption, PickerInstance, PopupInstance } from 'vant'
import { computed, defineComponent, ref, type PropType } from 'vue'

export default defineComponent({
  name: 'PopupSelect',
  props: {
    // 是否显示
    modelValue: {
      type: Boolean,
      default: false
    },
    // 选择类型 picker选择器、cascader联级选择
    type: {
      type: String,
      default: 'picker'
    },
    // 标题
    title: {
      type: String,
      default: ''
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
    },
    // 是否开启手势左右滑动切换
    swipeable: {
      type: Boolean,
      default: true
    },
    // 	是否显示关闭图标
    closeable: {
      type: Boolean,
      default: true
    }
  },
  emits: ['onPickerConfirm', 'update:modelValue', 'onCascaderChange', 'onCascaderFinish'],
  setup(props, { emit }) {
    const popupRef = ref<PopupInstance>()
    const pickerRef = ref<PickerInstance>()
    // 关闭弹出层时立即触发
    const onPopupClose = () => {
      console.log('onPopupClose', props.modelValue, props.columns)
      emit('update:modelValue', false)
    }
    // 点击完成按钮时触发
    const onPickerConfirm = (selectedValues: any, selectedOptions: any, selectedIndexes: number) => {
      emit('onPickerConfirm', selectedValues, selectedOptions, selectedIndexes)
      onPopupClose()
    }
    // 选中项变化时触发
    const onCascaderChange = (value: string | number, selectedOptions: CascaderOption[], tabIndex: number) => {
      emit('onCascaderChange', value, selectedOptions, tabIndex)
    }
    // 全部选项选择完成后触发
    const onCascaderFinish = (value: string | number, selectedOptions: CascaderOption[], tabIndex: number) => {
      emit('onCascaderFinish', value, selectedOptions, tabIndex)
      onPopupClose()
    }
    // 点击标签时触发
    const visible = computed(() => {
      return props.modelValue
    })
    return {
      popupRef,
      pickerRef,
      onPopupClose,
      onPickerConfirm,
      onCascaderChange,
      onCascaderFinish,
      visible
    }
  }
})
</script>

<style lang="stylus" scoped></style>
