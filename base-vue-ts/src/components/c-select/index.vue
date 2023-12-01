<template lang="pug">
.page-wrap
  .c-select
    el-select(
      v-model="value"
      placeholder="请选择"
      :style="{width: width || '100%'}"
      :clearable="clearable"
      v-bind="$attrs"
    )

      template(v-for="name in slots" #name)
        slot(:name="name")
      //- el-option(
      //-   v-for="(item, index) in optionSource"
      //-   :key="index + '_i'"
      //-   :label="item.label"
      //-   :value="item.value"
      //- )
</template>
<script lang="ts">
import { defineComponent, ref, shallowReactive } from 'vue'
export default defineComponent({
  name: 'Select',
  props: {
    width: {
      type: String || Number,
      default: '100%'
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  setup(props, context) {
    const attrs = context.attrs
    const value = ref('')
    const optionSource = shallowReactive([
      {
        value: 'Option1',
        label: 'Option1'
      },
      {
        value: 'Option2',
        label: 'Option2'
      },
      {
        value: 'Option3',
        label: 'Option3'
      },
      {
        value: 'Option4',
        label: 'Option4'
      },
      {
        value: 'Option5',
        label: 'Option5'
      }
    ])
    console.log('setup', context, attrs, context.slots)
    return {
      attrs,
      value,
      optionSource
    }
  }
})
</script>
<style lang="stylus" scoped></style>
