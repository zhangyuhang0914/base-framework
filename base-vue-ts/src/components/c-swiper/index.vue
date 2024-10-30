<template lang="pug">
  .c-swpier-container
    Swiper(
      :modules="swiperModules"
      :navigation="navigator"
      :loop="look"
      :effect="effect"
      :pagination="{ clickable: true }"
      :autoplay="autoplay ? autoplayParam : false"
      :slides-per-view="slidesPerView"
    )
      SwiperSlide(v-for="(item, index) in data" :key="index")
        slot(name="content" :item="item")
  </template>

  <script lang="ts">
  import { defineComponent, reactive, ref } from 'vue'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Autoplay, Pagination, Navigation, Scrollbar } from 'swiper/modules'
  import 'swiper/css' // 仅限核心 Swiper 样式
  import 'swiper/css/navigation' // 轮播图左右箭头所需的样式
  // https://swiperjs.com/swiper-api

  export default defineComponent({
    name: 'CSwiper',
    components: { Swiper, SwiperSlide },
    props: {
      data: {
        type: Array,
        default: () => []
      },
      // 是否显示导航
      navigator: {
        type: Boolean,
        default: true
      },
      // 是否自动切换
      autoplay: {
        type: Boolean,
        default: false
      },
      // 是否循环切换
      look: {
        type: Boolean,
        default: true
      },
      // 切换动画效果
      effect: {
        type: String,
        default: 'slide'
      },
      // 自动切换时间间隔 单位ms
      delay: {
        type: Number,
        default: 5000
      },
      // 是否暂停鼠标悬停
      pauseOnMouseEnter: {
        type: Boolean,
        default: true
      },
      // 每页显示个数
      slidesPerView: {
        type: Number,
        default: 3
      }
    },
    setup(props) {
      // 在modules加入要使用的模块
      const swiperModules = ref([Autoplay, Pagination, Navigation, Scrollbar])
      const autoplayParam = reactive({
        delay: props.delay,
        disableOnInteraction: false, // 用户操作 swiper 之后，是否禁止 autoplay。默认为 true：停止。
        pauseOnMouseEnter: props.pauseOnMouseEnter // 鼠标置于 swiper 时暂停自动切换，鼠标离开时恢复自动切换，默认 false
      })
      return {
        swiperModules,
        autoplayParam
      }
    }
  })
  </script>

  <style lang="stylus" scoped></style>
