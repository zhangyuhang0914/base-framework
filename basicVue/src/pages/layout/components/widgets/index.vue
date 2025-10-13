<template>
  <Drawer
    v-model:open="props.open"
    placement="right"
    :width="320"
    header-content="设置面板"
    @close="handleClose"
  >
    <div class="widgets-content">
      <h3 class="widgets-title">系统设置</h3>
      <div class="widgets-item">
        <span class="widgets-label">深色模式</span>
        <a-switch />
      </div>
      <div class="widgets-item">
        <span class="widgets-label">语言设置</span>
        <a-select defaultValue="zh-CN" :style="{ width: 120 }">
          <a-select-option value="zh-CN">中文</a-select-option>
          <a-select-option value="en-US">English</a-select-option>
        </a-select>
      </div>
      <div class="widgets-item">
        <span class="widgets-label">通知设置</span>
        <a-switch />
      </div>
    </div>
  </Drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Switch, Select } from 'ant-design-vue'
import { Drawer } from '@/components/antd'

interface WidgetsProps {
  open: boolean
}

interface WidgetsEmits {
  close: []
}

export default defineComponent({
  name: 'Widgets',
  components: {
    Drawer,
    'a-switch': Switch,
    'a-select': Select,
    'a-select-option': Select.Option
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props: WidgetsProps, { emit }: { emit: (event: keyof WidgetsEmits) => void }) {
    const handleClose = () => {
      emit('close')
    }

    return {
      props,
      handleClose
    }
  }
})
</script>

<style lang="scss" scoped>
.widgets-content {
  padding: 20px 0;
  .widgets-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 20px;
    padding: 0 24px;
  }
  .widgets-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    cursor: pointer;
    transition: all 0.3s;
    .widgets-label {
      font-size: 14px;
      color: #333;
    }
  }
  .widgets-item:hover {
    background-color: #f5f5f5;
  }
}
</style>
