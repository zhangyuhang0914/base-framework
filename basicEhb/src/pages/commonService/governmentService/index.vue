<template>
  <div class="wrap">
    <!-- 头部 -->
    <div class="header">
      <div class="logo">
        <i @click="goBack"></i>
      </div>
      <div class="banner">
        <img :src="bannerImg" alt="" />
      </div>
    </div>
    <!-- content -->
    <div class="content">
      <div class="grid p1">
        <div class="p1cont">
          <div class="p1title">
            <span>背</span>
            <span>景</span>
          </div>
          <p>
            {{ p1Text }}
            <i v-if="!isExpanded" @click="expandText"></i>
          </p>
        </div>
      </div>
      <div class="grid p2">
        <h3>
          工作动态
          <a class="more" href="javascript:void(0);" @click="goToArticleList">更多></a>
        </h3>
        <div class="cont p2cont">
          <ul>
            <li v-for="(item, index) in workNews" :key="index">
              <div class="left" :class="{ 'full-width': !item.image }">
                <a href="javascript:void(0);" @click="goToArticleDetail(index)">{{ item.title }}</a>
                <p>
                  <span class="from">{{ item.from }}</span>
                  <span class="date">{{ item.date }}</span>
                </p>
              </div>
              <div v-if="item.image" class="right">
                <a href="javascript:void(0);" @click="goToArticleDetail(index)">
                  <img :src="item.image" alt="" @error="handleImageError" />
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="grid p2 p3">
        <h3>
          政策文件
          <a class="more" href="javascript:void(0);" @click="goToArticleList">更多></a>
        </h3>
        <div class="cont p2cont">
          <ul>
            <li v-for="(item, index) in policyFiles" :key="index">
              <div class="left">
                <a href="javascript:void(0);" @click="goToArticleDetail(index, true)">
                  <b>{{ item.level }}</b>
                  {{ item.title }}
                </a>
                <p>
                  <span class="from">{{ item.from }}</span>
                  <span class="date">{{ item.date }}</span>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="grid p4">
        <h3>
          服务成效
          <a class="more" href="javascript:void(0);" @click="goToArticleList">更多></a>
        </h3>
        <div class="cont p4cont">
          <div class="row">
            <div class="col-md-6">
              <div class="left">
                <p>网络覆盖</p>
                <span>全省行政村广电5G覆盖率达80%</span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="right right1">
                <p>服务集成</p>
                <span>带动农产品线上销售额突破2000亿元</span>
              </div>
              <div class="right right2">
                <p>产业赋能</p>
                <span>基层治理效率提升50%以上</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="GovernmentServicePage">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
// 图片路径（请根据实际文件位置调整）
// 如果图片文件存在，可以使用 import 导入：
// 导入图片
import bannerImg from '../../otherService/2025/images/ehb_zhgd/banner.png'
import sltpImg from '../../otherService/2025/images/ehb_zhgd/sltp.jpeg'

// 返回上一页
const goBack = () => {
  window.history.back(-1)
}

// 使用Vue Router
const router = useRouter()

// 跳转到文章列表页
const goToArticleList = () => {
  router.push('/otherService/articlelist')
}

// 跳转到文章详情页
const goToArticleDetail = (index, isPolicy = false) => {
  // 这里可以传递参数，让详情页知道要显示哪个文章
  router.push({
    path: '/otherService/articledetail',
    query: {
      index: index.toString(),
      type: isPolicy ? 'policy' : 'news'
    }
  })
}

// 图片加载错误处理
const handleImageError = event => {
  console.error('图片加载失败:', event.target.src)
}

// 第一部分文本展开/收起
const isExpanded = ref(false)
const shortText =
  '为进一步贯彻《中华人民共和国乡村振兴促进法》关于"积极推动智慧广电乡村建设"规定，落实国家广播电视总局《关于推进智慧广电乡村工程建设的指导意见...'
const fullText =
  '为进一步贯彻《中华人民共和国乡村振兴促进法》关于"积极推动智慧广电乡村建设"规定，落实国家广播电视总局《关于推进智慧广电乡村工程建设的指导意见》（广电发〔2022〕1号）和《湖北省广播电视和网络视听"十四五"发展规划》《关于推进全省智慧广电发展的实施意见》精神，大力推进智慧广电乡村工程，服务乡村全面振兴战略，特制订本实施方案。'

const p1Text = ref(shortText)

const expandText = () => {
  isExpanded.value = true
  p1Text.value = fullText
}

// 工作动态数据
const workNews = ref([
  {
    title: '省广电局一行来通山调研智慧广电乡村工程，探索开展乡村有线电...',
    from: '湖北日报',
    date: '2025-08-31',
    image: sltpImg // 使用导入的图片
  },
  {
    title: '省广电局一行来通山调研智慧广电乡村工程...',
    from: '湖北日报',
    date: '2025-08-31',
    image: null // 没有图片
  },
  {
    title: '2025年基本实现广电5G行政村全覆盖，探索开展乡村有线电视基础节目低收费或免费服务',
    from: '国家广播电视总局',
    date: '2025-08-31',
    image: sltpImg
  },
  {
    title: '省广电局一行来通山调研智慧广电乡村工程，探索开展乡村有线电视基础节...',
    from: '湖北日报',
    date: '2025-08-31',
    image: null
  },
  {
    title: '省广电局一行来通山调研智慧广电乡村工程,2035 年远景目标...',
    from: '湖北日报',
    date: '2025-08-31',
    image: sltpImg
  }
])

// 政策文件数据
const policyFiles = ref([
  {
    level: '国家级',
    title: '《中华人民共和国国民经济和社会发展第十四个五年规划和 2035 年远景目标...',
    from: '国务院办公厅',
    date: '2025-08-31'
  },
  {
    level: '国家级',
    title: '《中华人民共和国国民经济和社会发展第十四个五年规划和 2035 年远景目标...',
    from: '国务院办公厅',
    date: '2025-08-31'
  },
  {
    level: '国家级',
    title: '《中华人民共和国国民经济和社会发展第十四个五年规划和 2035 年远景目标...',
    from: '国务院办公厅',
    date: '2025-08-31'
  },
  {
    level: '国家级',
    title: '《中华人民共和国国民经济和社会发展第十四个五年规划和 2035 年远景目标...',
    from: '国务院办公厅',
    date: '2025-08-31'
  },
  {
    level: '国家级',
    title: '《中华人民共和国国民经济和社会发展第十四个五年规划和 2035 年远景目标...',
    from: '国务院办公厅',
    date: '2025-08-31'
  }
])

// 动态加载脚本
const loadScript = src => {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`)
    if (existingScript) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.type = 'text/javascript'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(script)
  })
}

// 初始化并加载必要的脚本
onMounted(async () => {
  await nextTick()

  // 调试：输出图片路径
  console.log('bannerImg:', bannerImg)
  console.log('sltpImg:', sltpImg)
  console.log('workNews:', workNews.value)
  console.log('policyFiles:', policyFiles.value)

  try {
    // 动态加载 JS 文件（确保 DOM 已准备好）
    const scripts = [
      () => import('../../otherService/2025/js/jquery_1_12_4.js?url'),
      () => import('../../otherService/2025/js/common.js?url')
    ]

    for (const scriptLoader of scripts) {
      try {
        const scriptModule = await scriptLoader()
        const scriptUrl = scriptModule.default
        await loadScript(scriptUrl)
      } catch (error) {
        console.error('加载脚本失败:', error)
      }
    }
  } catch (error) {
    console.error('加载脚本失败:', error)
  }
})
</script>

<style>
/* 引入原有CSS文件（不使用 scoped，确保全局样式生效） */
@import url('https://gdj.hubei.gov.cn/material/css_2020/bootstrap.css');
@import url('https://gdj.hubei.gov.cn/material/css_2020/common.css');
@import url('https://gdj.hubei.gov.cn/material/css_2020/ui.css');
@import url('https://gdj.hubei.gov.cn/material/css_2020/gdj.css');
@import '../../otherService/2025/css/ehb_zhgd.css';
.p2 .left.full-width {
  width: 100%;
}
</style>
