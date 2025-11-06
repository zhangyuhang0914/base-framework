<template>
  <div class="wrap">
    <!-- 头部 -->
    <div class="header">
      <div class="logo">
        <i @click="goBack"></i>
        <p>公共服务标准化建设</p>
      </div>
      <div class="banner">
        <img :src="bannerImg" alt="" />
      </div>
    </div>
    <!-- content -->
    <div class="content">
      <div class="grid p1 mb50">
        <h3>政策支持</h3>
        <ul>
          <li v-for="(item, index) in policySupport" :key="index">
            <a :href="item.url">
              <b :class="{ sj: item.level === '省级' }">{{ item.level }}政策</b>
              {{ item.title }}
            </a>
          </li>
        </ul>
      </div>

      <div class="grid p2 mb50">
        <h3>"三化七有"标准</h3>
        <div class="p2cont">
          <div class="tab-pane mb30">
            <div class="tab">
              <a
                v-for="(tab, index) in tabs"
                :key="index"
                :class="{ current: activeTab === index }"
                @click="switchTab(index)"
              >
                {{ tab.name }}
              </a>
            </div>
            <div class="pane">
              <ul
                v-for="(list, index) in tabLists"
                :key="index"
                class="list-t"
                :style="{ display: activeTab === index ? 'block' : 'none' }"
              >
                <li v-for="(item, idx) in list" :key="idx">
                  <a href="">{{ item }}</a>
                </li>
              </ul>
            </div>
          </div>

          <div class="cjwt">
            <ul>
              <li v-for="(item, index) in commonQuestions" :key="index">
                <a href="">
                  <b>问</b>
                  {{ item }}
                </a>
              </li>
            </ul>
            <div class="more"><a href="">查看更多</a></div>
          </div>
        </div>
      </div>

      <div class="grid p3">
        <h3 class="mb30">服务成效</h3>
        <div class="p3cont mb30">
          <h4 class="mb40">各省、市级广电行政管理部门联系方式</h4>
          <div class="tab-pane">
            <div class="tab">
              <a
                v-for="(city, index) in cities"
                :key="index"
                :class="{ current: activeCity === index }"
                :style="{ display: showAllCities || index <= 3 ? 'inline-block' : 'none' }"
                @click="switchCity(index)"
              >
                {{ city }}
              </a>
            </div>
            <div class="qb" @click="toggleAllCities">
              全部
              <i></i>
            </div>
            <div class="pane">
              <ul
                v-for="(list, index) in cityContacts"
                :key="index"
                class="list-t"
                :style="{ display: activeCity === index ? 'block' : 'none' }"
              >
                <li v-for="(item, idx) in list" :key="idx">
                  <a href="">{{ item }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="p3cont">
          <h4 class="mb40">服务网络</h4>
          <div class="ejbmap">
            <TMap height="286px" show-search shape="round" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TMap from '@/components/map/index.vue'

// 返回上一页
const goBack = () => {
  window.history.back(-1)
}

// 图片资源
const bannerImg = ref('../../otherService/2025/images/ehb_ggfw/banner.png')

// 政策支持数据
const policySupport = ref([
  {
    level: '国家',
    title: '《中共中央办公厅国务院办公厅关于建立健全基本公共服务标...',
    url: 'https://gdj.hubei.gov.cn/2025/2025_01.html'
  },
  {
    level: '国家',
    title: '《中共中央办公厅国务院办公厅关于建立健全基本公共服务标...',
    url: 'https://gdj.hubei.gov.cn/2025/2025_01.html'
  },
  {
    level: '省级',
    title: '《中共中央办公厅国务院办公厅关于建立健全基本公共服务标...',
    url: 'https://gdj.hubei.gov.cn/2025/2025_01.html'
  },
  {
    level: '省级',
    title: '《中共中央办公厅国务院办公厅关于建立健全基本公共服务标...',
    url: 'https://gdj.hubei.gov.cn/2025/2025_01.html'
  }
])

// 三化七有标准 - 标签
const tabs = ref([{ name: '管理规范化' }, { name: '服务网络化' }, { name: '保障长期化' }])

const activeTab = ref(0)

const switchTab = index => {
  activeTab.value = index
}

// 标签内容数据
const tabLists = ref([
  ['管理有制度', '运行有规范'],
  ['管理有制度', '运行有规范'],
  ['管理有制度', '运行有规范']
])

// 常见问题
const commonQuestions = ref([
  '"户户通"的运行标准是什么？',
  '地面数字电视的运行标准是什么？',
  '村(居)广播电视公共服务代办员的工作职责有哪些？'
])

// 地市数据
const cities = ref([
  '武汉市',
  '襄阳市',
  '宜昌市',
  '黄石市',
  '十堰市',
  '荆州市',
  '荆门市',
  '鄂州市',
  '孝感市',
  '黄冈市',
  '咸宁市',
  '随州市',
  '恩施州',
  '仙桃市',
  '天门市',
  '潜江市',
  '神农架林区'
])

const activeCity = ref(0)
const showAllCities = ref(false)

const switchCity = index => {
  activeCity.value = index
}

const toggleAllCities = () => {
  showAllCities.value = !showAllCities.value
}

// 各地联系方式
const cityContacts = ref(cities.value.map(() => ['武汉市广播电视台', '武汉市广播电视台']))

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
  try {
    // 动态加载 JS 文件
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

<style scoped>
/* 引入原有CSS文件（不使用 scoped，确保全局样式生效） */
@import url('https://gdj.hubei.gov.cn/material/css_2020/bootstrap.css');
@import url('https://gdj.hubei.gov.cn/material/css_2020/common.css');
@import url('https://gdj.hubei.gov.cn/material/css_2020/ui.css');
@import url('https://gdj.hubei.gov.cn/material/css_2020/gdj.css');
@import '../../otherService/2025/css/ehb_ggfw.css';
</style>
