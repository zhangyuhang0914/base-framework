<template>
  <div class="wrap">
    <!-- 头部 -->
    <div class="header">
      <div class="logo">
        <i @click="goBack"></i>
        <p>政策文件</p>
      </div>
    </div>
    <!-- content -->
    <div class="content">
      <div class="grid p2 p3">
        <div class="cont p2cont">
          <ul>
            <li v-for="(item, index) in articleList" :key="index">
              <div class="left">
                <a href="javascript:void(0);" @click="goToDetail(index)">
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 返回上一页
const goBack = () => {
  window.history.back(-1)
}

// 使用Vue Router
const router = useRouter()
const route = useRoute()

// 跳转到详情页
const goToDetail = index => {
  router.push({
    path: '/otherService/articledetail',
    query: {
      index: index.toString(),
      type: 'list'
    }
  })
}

// 检查是否有从其他页面传递的参数
onBeforeMount(() => {
  // 可以在这里根据路由参数做一些初始化操作
  console.log('路由参数:', route.query)
})

// 文章列表数据
const articleList = ref([
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

  try {
    // 动态加载 JS 文件
    const scripts = [
      () => import('../otherService/2025/js/jquery_1_12_4.js?url'),
      () => import('../otherService/2025/js/common.js?url')
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
@import '../otherService/2025/css/ehb_articlelist.css';

.header {
  background: #ffffff;
}
</style>
