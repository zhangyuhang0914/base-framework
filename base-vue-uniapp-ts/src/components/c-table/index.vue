<template lang="pug">
.table-data(v-for="(item, index) in tableData" :key="index")
  .c-table-header
    slot(name="header" :item="item")
  .c-table-content
    slot(name="content" :item="item")
u-loadmore(v-show="status === 'loading'" :status="status")
</template>

<script>
import { defineComponent, watch, onMounted } from 'vue'
export default defineComponent({
  name: 'CTable',
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    status: {
      type: String,
      default: 'nomore'
    }
  },
  setup(props, { emit }) {
    watch(
      () => props.status,
      val => {}
    )
    onMounted(() => {})
    return {}
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
