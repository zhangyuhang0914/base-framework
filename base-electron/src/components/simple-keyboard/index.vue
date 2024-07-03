<template lang="pug">
.keyboardClass(:class="keyboardClass")
</template>

<script>
import SimpleKeyboard from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'
import layout from 'simple-keyboard-layouts/build/layouts/chinese' // 中文输入法
import { ref, defineProps, reactive, onMounted, watch } from 'vue'
export default {
  name: 'SimpleKeyboard',
  props: {
    keyboardClass: {
      type: String,
      default: 'simple-keyboard'
    },
    input: {
      type: [Number, String],
      default: ''
    },
    maxLength: {
      type: [Number, String],
      default: ''
    }
  },
  emits: ['parentMethods', 'onChange', 'onKeyPress'],
  setup(props, { emit }) {
    const keyboard = ref(null)
    const displayDefault = reactive({
      '{bksp}': 'backspace',
      '{lock}': 'caps',
      '{enter}': 'enter',
      '{tab}': 'tab',
      '{shift}': 'shift',
      '{change}': '中文',
      '{space}': '空格',
      '{clear}': '清空',
      '{close}': '关闭'
    })
    const onChange = input => {
      keyboard.value.setInput(input)
      emit('onChange', input)
    }
    // 点击键盘
    const onKeysPress = (button, $event) => {
      console.log('点击键盘', button, $event)
      // 点击关闭
      if (button === '{close}') {
        // 子组件调用父组件的关闭按钮方法
        emit('parentMethods', 'closekeyboard')
        // keyboard.style.visibility = 'hidden'
        return false
      } else if (button === '{change}') {
        // 切换中英文输入法
        // if (
        //   keyboard.value.options.layoutCandidates &&
        //   Object.keys(keyboard.value.options.layoutCandidates).length !== 0
        // )
        if (keyboard.value.options.layoutCandidates !== null) {
          displayDefault['{change}'] = '英文'
          // 切换至英文
          keyboard.value.setOptions({
            layoutCandidates: null,
            display: displayDefault
          })
        } else {
          // 切换至中文
          displayDefault['{change}'] = '中文'
          keyboard.value.setOptions({
            layoutCandidates: layout.layoutCandidates,
            display: displayDefault
          })
        }
      } else if (button === '{clear}') {
        keyboard.value.clearInput()
      } else {
        let value =
          $event.target.offsetParent.parentElement.children[0].children[0].value
        // 输入框有默认值时，覆写
        if (value) {
          keyboard.value.setInput(value)
        }
        emit('onKeyPress', button)
      }
      if (button === '{shift}' || button === '{lock}') handleShift()
    }
    // 切换shift/默认布局
    const handleShift = () => {
      console.log('keyboard', keyboard.value)
      let currentLayout = keyboard.value.options.layoutName
      let shiftToggle = currentLayout === 'default' ? 'shift' : 'default'
      keyboard.value.setOptions({
        layoutName: shiftToggle
      })
    }
    watch(
      () => props.input,
      value => {
        keyboard.value.setInput(value)
      }
    )
    onMounted(() => {
      keyboard.value = new SimpleKeyboard(props.keyboardClass, {
        onChange: onChange,
        onKeyPress: onKeysPress,
        layoutCandidates: layout.layoutCandidates,
        layout: {
          // 默认布局
          default: [
            '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
            '{tab} q w e r t y u i o p [ ] \\',
            "{lock} a s d f g h j k l ; ' {enter}",
            '{shift} z x c v b n m , . / {clear}',
            '{change} {space} {close}'
          ],
          shift: [
            '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
            '{tab} Q W E R T Y U I O P { } |',
            '{lock} A S D F G H J K L : " {enter}',
            '{shift} Z X C V B N M < > ? {clear}',
            '{change} {space} {close}'
          ]
        },
        // 按钮展示文字
        display: displayDefault,
        // 按钮样式
        buttonTheme: [
          {
            class: 'hg-red close',
            buttons: '{close}'
          },
          {
            class: 'change',
            buttons: '{change}'
          }
        ],
        // 输入限制长度
        maxLength: props.maxLength
      })
      console.log('layoutCandidates', layout, layout.layoutCandidates)
    })
    return {
      keyboard,
      displayDefault,
      onChange,
      onKeysPress,
      handleShift
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
