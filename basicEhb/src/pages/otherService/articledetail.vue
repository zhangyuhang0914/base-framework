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
      <div class="option">
        <div>
          <h3 class="title">{{ article.title }}</h3>
          <p>
            <span>发布时间：{{ article.publishTime }}</span>
            <span class="line">|</span>
            <span>来源：{{ article.source }}</span>
          </p>
        </div>
      </div>
      <div class="article">
        <p>{{ article.content1 }}</p>
        <p><img :src="currentImage" alt="文章图片" @error="handleImageError" /></p>
        <p>{{ article.content2 }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
// 图片资源
import articleImage from '../otherService/2025/images/ehb_robot/wzpic.png'
import sltpImg from '../otherService/2025/images/ehb_zhgd/sltp.jpeg'

// 返回上一页
const goBack = () => {
  window.history.back(-1)
}

// 使用Vue Router获取路由参数
const route = useRoute()

// 预定义多组文章数据，用于展示不同内容
const articleTemplates = [
  {
    title: '湖北省智慧广电乡村工程建设实施方案',
    publishTime: '2025-10-19 20:55',
    source: '湖北日报',
    content1:
      '2月19日为进一步贯彻《中华人民共和国乡村振兴促进法》关于"积极推动智慧广电乡村建设"规定，落实国家广播电视总局《关于推进智慧广电乡村工程建设的指导意见》（广电发〔2022〕1号）和《湖北省广播电视和网络视听"十四五"发展规划》《关于推进全省智慧广电发展的实施意见》精神，大力推进智慧广电乡村工程，服务乡村全面振兴战略，特制订本实施方案。以习近平新时代中国特色社会主义思想为指导，全面贯彻党的二十大和二十届一中、二中全',
    content2:
      '会精神，深入贯彻习近平总书记考察湖北重要讲话精神以及关于"打造智慧广电媒体，发展智慧广电网络"的重要指示精神，大力实施智慧广电乡村工程，全面提升乡村广播电视数字化、网络化、智能化水平，推进智慧广电服务乡村振兴战略，不断推动乡村振兴取得新进展，更好地服务文化强国、数字中国和网络强国建设。到2025年底，乡村有线电视网络数字化转型和光纤化、IP化改造取得突破，基本实现广电5G网络全省行政村全覆盖，乡村文化和信息基础设施服务能力明显提升。智能型、移动型终端得到普及，智慧广电进村入户到人，新业态新模式新场景得到广泛拓展，基本实现广播电视由功能型向智慧型转变。乡村广播电视和网络视听节目制作和宣传推广能力进一步增强，在气象服务、农技推广、灾害预警、生态保护、环境监测等场景得到应用，服务乡村治理能力和治理体系建设效率提升。智慧广电乡村工程服务长效机制基本建立，"智慧广电+公共服务+社会治理+产业振兴"新路径基本形成。智慧广电公共服务优质高效、普惠便捷。',
    image: articleImage
  },
  {
    title: '省广电局一行来通山调研智慧广电乡村工程',
    publishTime: '2025-08-31 14:30',
    source: '湖北日报',
    content1:
      '近日，省广电局一行来到通山县，深入调研智慧广电乡村工程建设情况。调研组先后走访了多个乡镇和行政村，详细了解了当地智慧广电基础设施建设、服务内容和运营模式等情况。',
    content2:
      '在调研过程中，调研组对通山县在智慧广电乡村工程建设方面取得的成绩给予了充分肯定，并就下一步工作提出了具体要求。强调要进一步加大投入，完善基础设施建设，扩大覆盖面，提升服务质量，为乡村振兴提供有力支撑。',
    image: sltpImg
  },
  {
    title: '《中华人民共和国国民经济和社会发展第十四个五年规划和2035年远景目标纲要》',
    publishTime: '2025-03-15 09:00',
    source: '国务院办公厅',
    content1:
      '《中华人民共和国国民经济和社会发展第十四个五年规划和2035年远景目标纲要》明确提出，要推进数字乡村建设，加强农村信息基础设施建设，发展智慧农业，推动信息技术在农业农村广泛应用。',
    content2:
      '纲要指出，要加快推进农村地区宽带网络和5G网络建设，实现行政村宽带网络全覆盖。要发展智慧农业，推动物联网、大数据、人工智能等信息技术与农业深度融合，提升农业生产智能化、经营网络化、管理高效化、服务便捷化水平。',
    image: articleImage
  }
]

// 文章数据
const article = ref(articleTemplates[0])
const currentImage = ref(articleTemplates[0].image)

// 根据路由参数设置文章内容
onBeforeMount(() => {
  const index = parseInt(String(route.query.index)) || 0
  const type = String(route.query.type) || 'list'

  console.log('从路由接收的参数:', { index, type })

  // 根据索引选择对应的文章模板
  if (index >= 0 && index < articleTemplates.length) {
    article.value = articleTemplates[index]
    currentImage.value = articleTemplates[index].image
  }
})

// 图片加载错误处理
const handleImageError = event => {
  console.error('图片加载失败:', event.target.src)
}

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
@import '../otherService/2025/css/ehb_articledetail.css';

.header {
  background: #ffffff;
}
</style>
