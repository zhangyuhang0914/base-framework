<template>
  <div class="layoutFooter">
    <a-button type="primary">我是底部</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Button } from 'ant-design-vue'

export default defineComponent({
  name: 'LayoutFooter',
  components: {
    'a-button': Button
  },
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.layoutFooter {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
}
</style>
