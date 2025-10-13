<template>
  <Drawer v-model:open="open" v-bind="$attrs" @close="handleClose" @openChange="handleOpenChange">
    <!-- 自定义头部 -->
    <template v-if="!showHeader" #header>
      <div class="drawer-custom-header">
        <button
          v-if="showResetButton && resetButtonProps"
          type="button"
          :class="resetButtonProps.className || 'drawer-reset-btn'"
          :style="resetButtonProps.style"
          @click.stop="handleReset"
        >
          {{ resetButtonProps.text || '重置' }}
          <RotateCw />
        </button>
        <button
          v-if="showCloseButton"
          type="button"
          class="drawer-close-btn"
          @click.stop="handleClose"
        >
          <X />
        </button>
      </div>
    </template>

    <!-- 内容区域 -->
    <div class="drawer-content-wrapper">
      <slot />
    </div>

    <!-- 自定义底部 -->
    <template v-if="footer" #footer>
      <div class="drawer-footer">
        <slot name="footer">
          {{ footer }}
        </slot>
      </div>
    </template>
  </Drawer>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { Drawer } from 'ant-design-vue'
import type { DrawerProps } from 'ant-design-vue'
import { RotateCw, X } from 'lucide-vue-next'

/**
 * 扩展DrawerProps接口，添加自定义属性
 */
export interface DrawerExtendedProps extends DrawerProps {
  /** 自定义头部内容 */
  headerContent?: string
  /** 是否显示自定义头部，默认为true */
  showHeader?: boolean
  /** 是否显示关闭按钮，默认为true */
  showCloseButton?: boolean
  /** 是否显示重置按钮 */
  showResetButton?: boolean
  /** 重置按钮属性 */
  resetButtonProps?: {
    text?: string
    className?: string
    style?: Record<string, any>
    onClick?: () => void
  }
  /** 自定义底部内容 */
  footer?: any
  /** 打开状态，支持v-model */
  modelValue?: boolean
}

/**
 * 抽屉组件
 */
export default defineComponent({
  name: 'Drawer',
  inheritAttrs: false, // 禁止默认将属性传递给根元素
  components: {
    RotateCw,
    X
  },
  props: {
    // 组件特有属性
    headerContent: {
      type: String,
      default: undefined
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showCloseButton: {
      type: Boolean,
      default: true
    },
    showResetButton: {
      type: Boolean,
      default: false
    },
    resetButtonProps: {
      type: Object,
      default: undefined
    },
    footer: {
      type: [String, Object, Function],
      default: undefined
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    // 设置一些常用属性的默认值
    width: {
      type: [Number, String],
      default: 384
    },
    placement: {
      type: String,
      default: 'right'
    },
    closable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'close', 'openChange'],
  setup(props, { emit, expose }) {
    // 计算打开状态
    const open = computed({
      get: () => props.modelValue || false,
      set: value => emit('update:modelValue', value)
    })

    // 处理关闭事件
    const handleClose = () => {
      emit('close')
      open.value = false
    }

    // 处理打开状态变化
    const handleOpenChange = (openStatus: boolean) => {
      open.value = openStatus
      emit('openChange', openStatus)
    }

    // 处理重置按钮点击
    const handleReset = () => {
      if (props.resetButtonProps?.onClick) {
        props.resetButtonProps.onClick()
      }
    }

    // 导出方法
    expose({
      close: handleClose,
      openDrawer: () => {
        open.value = true
      }
    })

    return {
      open,
      handleClose,
      handleOpenChange,
      handleReset
    }
  }
})
</script>

<style scoped>
.drawer-custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.drawer-header-content {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.drawer-reset-btn {
  padding: 4px 12px;
  margin-right: 12px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
}

.drawer-reset-btn:hover {
  color: #40a9ff;
  border-color: #40a9ff;
}

.drawer-close-btn {
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #999;
  border-radius: 2px;
  transition: all 0.3s;
}

.drawer-close-btn:hover {
  background: #f5f5f5;
  color: #666;
}

.drawer-content-wrapper {
  padding: 24px;
}

.drawer-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  text-align: right;
}
</style>
