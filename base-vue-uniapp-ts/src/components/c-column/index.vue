<template lang="pug">
.row-box(:class="{ 'border-bottom': isShowLine }")
  .title(v-if="label" :style="{ width: `${labelWidth}rpx` }")
    span.red(v-if="required") *
    span.txt {{label}}
  .content(:class="{ 'c-disabled': disabled && ['input', 'select-input'].includes(inputType) }" :style="{ width: `calc(100% - ${labelWidth}rpx - 30rpx)` }")
    slot(name="content")
      input.text-input(ref="cInputRef" v-if="inputType == 'input'" :value="modelValue" @change='change' :type="inputTypeName" :class="[inputTypeClass]" :placeholder="placeholder" :readOnly="readOnly" :disabled="readOnly" :pattern="inputPattern" :always-embed="true" @input="$emit('update:modelValue', $event?.target.value)" @keydown="onlyNum($event)" @blur="onInputBlur")
      input.select-input(ref="cSelectInputRef" v-if="inputType == 'select-input'" :value="modelValue" @change='change' :type="inputTypeName" :class="[inputTypeClass]" :placeholder="placeholder" :readOnly="readOnly" :disabled="readOnly" :always-embed="true" @input="$emit('update:modelValue', $event?.target.value)" @click.capture="onClickInput")
      uni-data-select.select(ref="cSelectRef" v-if="inputType == 'select'" v-model="selectValue" :localdata="selectData" @change="onChangeSelect" :class="[inputTypeClass]" :placeholder="placeholder" :clear="selectClear" :disabled="readOnly")
      textarea.textarea(ref="cTextarea" v-if="inputType == 'textarea'" :value="modelValue" :class="[inputTypeClass]" :placeholder="placeholder" :readOnly="readOnly" :disabled="readOnly" :maxlength="maxlength" @input="$emit('update:modelValue', $event?.target.value)")
      slot(name="right")
        i.iconfont(v-if="arrow" :class="icon" @click="onClickInput")
</template>

<script>
export default defineComponent({
  name: 'CRow',
  props: {
    isShowLine: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: ''
    },
    selectData: {
      type: Array,
      default: () => []
    },
    selectClear: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    inputType: {
      type: String,
      default: 'input'
    },
    inputTypeName: {
      type: String,
      default: 'text'
    },
    inputTypeClass: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inputPattern: {
      type: String,
      default: ''
    },
    isNum: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '160'
    },
    icon: {
      type: String,
      default: 'icon-jiantou'
    },
    arrow: {
      type: Boolean,
      default: false
    },
    customValidator: {
      type: Function,
      default: () => {}
    },
    maxlength: {
      type: Number,
      default: 200
    }
  },
  emits: ['update:modelValue', 'change', 'onBlur', 'onSelect'],
  setup(props, { emit }) {
    const cInputRef = ref(null)
    const cSelectInputRef = ref(null)
    const cSelectRef = ref(null)
    const cTextarea = ref(null)
    const selectValue = ref(props.modelValue)
    // 仅支持数字
    const onlyNum = e => {
      if (props.isNum) {
        if ((e.keyCode >= 97 && e.keyCode <= 105) || (e.keyCode >= 49 && e.keyCode <= 57) || e.keyCode === 8) {
          e.returnValue = true
          return
        }
        e.returnValue = false
      } else {
        return false
      }
    }
    const change = () => {
      emit('change', props.modelValue)
    }
    // 监听失去焦点
    const onInputBlur = () => {
      emit('onBlur')
    }
    const onClickInput = () => {
      if (props.disabled) return false
      emit('onSelect')
    }
    const onChangeSelect = value => {
      emit('onSelect', value)
    }
    watch(
      () => props.modelValue,
      val => {
        selectValue.value = val
      }
    )
    onMounted(() => {})
    return {
      cInputRef,
      cSelectInputRef,
      cSelectRef,
      cTextarea,
      selectValue,
      onlyNum,
      change,
      onInputBlur,
      onClickInput,
      onChangeSelect
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
