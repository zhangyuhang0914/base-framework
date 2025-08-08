<template lang="pug">
  AntDesginApp
    ConfigProvider
</template>

<script lang="ts">
import { App as AntDesginApp, ConfigProvider } from 'ant-design-vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
    AntDesginApp,
    ConfigProvider
  },
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped></style>
