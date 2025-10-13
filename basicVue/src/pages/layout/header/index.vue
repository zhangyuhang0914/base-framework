<template>
  <div class="layoutHeader">
    <div class="headerLeft">
      <a-button type="primary">我是头部</a-button>
    </div>
    <div class="headerRight">
      <a-button
        type="text"
        shape="circle"
        :icon="SettingOutlined"
        @click="handleOpenSettings"
      />
      <Widgets :open="settingsOpen" @close="handleCloseSettings" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Button } from 'ant-design-vue'
import { SettingOutlined } from '@ant-design/icons-vue'
import Widgets from '@/pages/layout/components/widgets/index.vue'

export default defineComponent({
  name: 'LayoutHeader',
  components: {
    'a-button': Button,
    SettingOutlined,
    Widgets
  },
  setup() {
    const settingsOpen = ref(false)
    // 打开设置抽屉
    const handleOpenSettings = () => {
      settingsOpen.value = true
    }
    // 关闭设置抽屉
    const handleCloseSettings = () => {
      settingsOpen.value = false
    }
    return {
      SettingOutlined,
      settingsOpen,
      handleOpenSettings,
      handleCloseSettings
    }
  }
})
</script>

<style lang="scss" scoped>
.layoutHeader {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  .headerLeft {
    display: flex;
    align-items: center;
  }
  .headerRight {
    display: flex;
    align-items: center;
  }
}
</style>
