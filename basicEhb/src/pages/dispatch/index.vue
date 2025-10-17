<template lang="pug">
  vanButton(type="primary" @click="toHomePage") 返回首页
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Dispatch',
  components: {},
  setup() {
    const router = useRouter()
    // 跳转首页
    const toHomePage = () => {
      router.go(-1)
    }
    return {
      toHomePage
    }
  }
})
</script>

<style lang="scss" scoped></style>
