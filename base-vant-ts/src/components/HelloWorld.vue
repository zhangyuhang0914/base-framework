<template lang="pug">
.page-view
  van-button(type="primary" @click="openDevices") {{ '摄像头' }}
  video(id="video" width="640" height="480")
  canvas(id="canvas" width="640" height="480")
  //- <div class="test-loading" v-loading="loading" v-longpress="onPress()">
  //-   <h1>{{ 'msg' }}</h1>
  //-   <div class="card">
  //-     <button type="button" @click="handleCount">count is {{ count }}</button>
  //-     <p>
  //-       Edit
  //-       <code>components/HelloWorld.vue</code> to test HMR
  //-     </p>
  //-   </div>
  //-   <p>
  //-     Check out
  //-     <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
  //-       >create-vue</a
  //-     >, the official Vue + Vite starter
  //-   </p>
  //-   <p>
  //-     Install
  //-     <a href="https://github.com/vuejs/language-tools" target="_blank"
  //-       >Volar</a
  //-     >
  //-     in your IDE for a better DX
  //-   </p>
  //-   <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  //- </div>
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
const openDevices = () => {
  // 判断是不是IOS系统
  const isIOS =
    // @ts-ignore
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  // 获取video和canvas元素
  const video = document.getElementById('video') as HTMLVideoElement
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  console.log(
    'navigator.mediaDevices.getUserMedia',
    navigator.mediaDevices.getUserMedia
  )
  // 获取媒体流
  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: isIOS ? 'user' : { exact: 'environment' }
      }
    })
    .then(function (stream) {
      video.srcObject = stream
      video.play()
    })
    .catch(function (err) {
      console.log(err)
    })

  // 绘制视频流到canvas
  function draw() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    requestAnimationFrame(draw)
  }

  // 开始绘制
  video.addEventListener('play', function () {
    draw()
  })
  console.log('openDevices', navigator.mediaDevices.getUserMedia())
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
