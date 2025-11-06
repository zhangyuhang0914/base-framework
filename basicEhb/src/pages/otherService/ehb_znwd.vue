<template>
  <div class="wrap">
    <!-- 头部 -->
    <div class="header">
      <div class="logo">
        <i @click="goBack"></i>
        <p>常见问题</p>
      </div>

      <h2>智能问答</h2>
      <span>Hi~欢迎来到您的专属智能问答平台</span>
      <img src="./2025/images/znwd/banner.png" alt="" />
    </div>

    <!-- content -->
    <div class="content">
      <div id="znwd">
        <ul id="intelligentQAInfo" class="basescroll">
          <li class="czkj-robot1">
            <div class="overlay">
              <div class="czkj-msg">
                <div class="czkj-msg-top">
                  <img src="./2025/images/znwd/robot.png" />
                  <p>您好！我是湖北省广播电视局智能机器人。请问有什么可以帮您的？</p>
                </div>
                <div class="czkj-msg-bottom">
                  <p>
                    <img class="icon1" src="./2025/images/znwd/noct.png" />
                    猜你想问：
                    <span id="refresh" @click="refreshQuestions">
                      <img class="icon2" src="./2025/images/znwd/refresh.png" alt="" />
                      换一批
                    </span>
                  </p>
                  <div id="czkj-question">
                    <ul class="czkj-question-ul" id="czkj-question-ul">
                      <li v-for="(question, index) in displayedQuestions" :key="index">
                        <a
                          href="javascript:void(0)"
                          :title="question.title"
                          @click="selectQuestion(question)"
                        >
                          {{ question.title }}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li class="czkj-user">
            <div class="czkj-msg">"一网一园一中心"</div>
          </li>
          <li class="czkj-robot">
            <div class="czkj-msg">
              <div>
                全省有线电视整合发展，中国（湖北）网络视听产业
                园，中国（湖北）广播电视媒体融合发展创新中心
              </div>
            </div>
          </li>
        </ul>

        <div class="czkj-chat-input">
          <div class="hint-input-list chat-toggle"></div>
          <textarea
            placeholder="请输入您的问题"
            class="czkj-question"
            id="questionMessage"
            v-model="questionInput"
            @keyup="handleSearchInput"
          ></textarea>

          <div class="jt1">
            <div class="panel-body" :hidden="!showSuggestions" id="panel-body1">
              <table
                class="table table-hover general-table"
                style="margin-bottom: 0px; position: absolute"
              >
                <tbody id="name1">
                  <tr
                    v-for="(suggestion, index) in suggestions"
                    :key="index"
                    @click="selectSuggestion(suggestion)"
                  >
                    <td v-html="highlightKeywords(suggestion)"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="czkj-enter">
            <div id="sendQuestionOpt" class="czkj-enter-btn send-btn">
              <a href="javascript: void(0);" class="draw-btn" title=""><i></i></a>
            </div>
          </div>
          <div class="czkj-send"></div>
          <ul class="czkj-suggest"></ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 问题数据
const questions = ref([
  { title: '"一网一园一中心"' },
  { title: '重点网络影视剧是什么？' },
  { title: '如何通过网络上传广播电视类申请材料?' },
  { title: '什么是"村村响"？' },
  { title: '个人可以随意安装、使用卫星锅吗？为什么？' },
  { title: '国家对设立广播电视节目制作经营机构或从事广播电视节目制作经营活动有什么要求？' },
  { title: '持有《广播电视节目制作经营许可证》可以从事什么活动？' },
  { title: '湖北省广播电视局政务服务大厅在哪里？' },
  { title: '重点网络影视剧是什么？' },
  { title: '如何通过网络上传广播电视类申请材料?' },
  { title: '什么是"村村响"？' },
  { title: '个人可以随意安装、使用卫星锅吗？为什么？' }
])

// 分页相关
const currentPage = ref(0)
const itemsPerPage = 4
const displayedQuestions = ref([])

// 搜索相关
const questionInput = ref('')
const suggestions = ref([])
const showSuggestions = ref(false)

// 返回上一页
const goBack = () => {
  window.history.back(-1)
}

// 刷新问题列表（分页）
const refreshQuestions = () => {
  const totalItems = questions.value.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // 计算下一页
  currentPage.value++
  if (currentPage.value >= totalPages) {
    currentPage.value = 0 // 重置到第一页
  }

  // 计算起始和结束索引
  const startIndex = currentPage.value * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  // 更新显示的问题
  displayedQuestions.value = questions.value.slice(startIndex, endIndex)
}

// 处理搜索输入
const handleSearchInput = async () => {
  const keywords = questionInput.value
  if (keywords === '') {
    showSuggestions.value = false
    return
  }

  try {
    const response = await fetch(
      `http://gdj.hubei.gov.cn/igs/front/suggest/term.jhtml?searchWord=${keywords}&code=03074fc5eaae4cd5b5be57bd3fe4e9b6`
    )
    const data = await response.json()
    suggestions.value = data
    showSuggestions.value = data.length > 0
  } catch (error) {
    console.error('获取搜索建议失败:', error)
    showSuggestions.value = false
  }
}

// 选择搜索建议
const selectSuggestion = suggestion => {
  questionInput.value = suggestion
  showSuggestions.value = false
}

// 选择问题
const selectQuestion = question => {
  // 这里可以添加处理用户选择问题的逻辑
  console.log('用户选择了问题:', question.title)
}

// 高亮关键词
const highlightKeywords = text => {
  const keywords = questionInput.value
  if (!keywords) return text
  return text.replace(
    new RegExp(`(${keywords})`, 'g'),
    `<span class='gray' style='vertical-align:bottom;'>${keywords}</span>`
  )
}

// 初始化显示前4个问题
onMounted(() => {
  displayedQuestions.value = questions.value.slice(0, itemsPerPage)
})
</script>

<style scoped>
/* 引入原有CSS文件 */
@import url('https://gdj.hubei.gov.cn//material/css_2020/bootstrap.css');
@import url('https://gdj.hubei.gov.cn//material/css_2020/common.css');
@import url('https://gdj.hubei.gov.cn//material/css_2020/ui.css');
@import url('https://gdj.hubei.gov.cn//material/css_2020/gdj.css');
@import url('./2025/css/ehb_robot.css');
</style>
