<template lang="pug">
.test-wrap
  .test-list
    span(@click="handleClick") {{ myText }}
    canvas(id="my-canvas")
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: 'Test',
  setup() {
    const myText = ref('我是测试页')
    const router = useRouter()
    const handleClick = () => {
      router.push({
        name: 'homePage'
      })
    }
    onMounted(() => {
      // 画布
      const myCanvas = document.getElementById('my-canvas')
      // 获取上下文
      const ctx = myCanvas.getContext('2d')
      myCanvas.width = document.documentElement.clientWidth - 30
      myCanvas.height = document.documentElement.clientHeight - 30
      class Ball {
        constructor() {
          this.x = Math.floor(Math.random() * myCanvas.width)
          this.y = Math.floor(Math.random() * myCanvas.height)
          this.r = 10
          this.color = 'gray'
          this.dx = Math.floor(Math.random() * 10) - 5
          this.dy = Math.floor(Math.random() * 10) - 5
          ballArr.push(this)
        }
        // 渲染小球
        render() {
          if (ctx !== null) {
            ctx.beginPath()
            // 透明度
            ctx.globalAlpha = 1
            // 画小球
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
            ctx.fillStyle = this.color
            ctx.fill()
          }
        }
        // 更新小球
        update() {
          // 小球的运动
          this.x += this.dx
          if (this.x <= this.r) {
            this.x = this.r
          } else if (this.x >= myCanvas.width - this.r) {
            this.x = myCanvas.width - this.r
          }
          this.y += this.dy
          if (this.y <= this.r) {
            this.y = this.r
          } else if (this.y >= myCanvas.height - this.r) {
            this.y = myCanvas.height - this.r
          }
          if (this.x + this.r >= myCanvas.width || this.x - this.r <= 0) {
            this.dx *= -1
          }
          if (this.y + this.r >= myCanvas.height || this.y - this.r <= 0) {
            this.dy *= -1
          }
        }
      }
      // 维护小球的数组
      let ballArr = []
      for (let i = 0; i < 20; i++) {
        new Ball()
      }
      setInterval(() => {
        if (ctx !== null) {
          ctx.clearRect(0, 0, myCanvas.width, myCanvas.height)
        }
        for (let i = 0; i < ballArr.length; i++) {
          ballArr[i].render()
          ballArr[i].update()
        }
        if (ctx !== null) {
          for (let i = 0; i < ballArr.length; i++) {
            for (let j = i + 1; j < ballArr.length; j++) {
              let distance = Math.sqrt(
                Math.pow(ballArr[i].x - ballArr[j].x, 2) +
                  Math.pow(ballArr[i].y - ballArr[j].y, 2)
              )
              if (distance <= 150) {
                ctx.strokeStyle = '#000'
                ctx.beginPath()
                ctx.globalAlpha = 1 - distance / 150
                ctx.moveTo(ballArr[i].x, ballArr[i].y)
                ctx.lineTo(ballArr[j].x, ballArr[j].y)
                ctx.closePath()
                ctx.stroke()
              }
            }
          }
        }
      }, 1000 / 60)
    })
    return {
      myText,
      handleClick
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
