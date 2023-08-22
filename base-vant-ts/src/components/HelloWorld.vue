<template>
  <div class="test-loading" v-loading="loading" v-longpress="onPress()">
    <h1>{{ 'msg' }}</h1>
    <div class="card">
      <button type="button" @click="handleCount">count is {{ count }}</button>
      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test HMR
      </p>
    </div>
    <p>
      Check out
      <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
        >create-vue</a
      >, the official Vue + Vite starter
    </p>
    <p>
      Install
      <a href="https://github.com/vuejs/language-tools" target="_blank"
        >Volar</a
      >
      in your IDE for a better DX
    </p>
    <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Bus, { TEST_EVENT_BUS } from '@/commons/bus'
const count = ref(0)
const loading = ref(true)
const handleCount = (): void => {
  count.value++
  Bus.$emit(TEST_EVENT_BUS, {
    name: 'zhangyuhang',
    company: 'JR'
  })
}
const onPress = () => {
  return (e: any) => {
    console.log(e)
  }
}
onMounted(() => {
  Bus.$on(TEST_EVENT_BUS, (data: any) => {
    console.log('data', TEST_EVENT_BUS, data)
  })
})
</script>

<style scoped>
.test-loading {
  height: 100%;
}
.read-the-docs {
  color: #888;
}
</style>
