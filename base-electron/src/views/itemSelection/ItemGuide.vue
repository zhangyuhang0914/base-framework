<script setup>
const router = useRouter()
const route = useRoute()
let itemId = route.query.itemId
let guideTab = ref('baseInfo')
let guideTabPane = ref({
  baseInfo: {
    name: 'baseInfo',
    label: '基本信息',
    formItem: [{
      label: '事项名称',
      key: 'name',
      value: ''
    }, {
      label: '实施名称',
      key: 'name',
      value: ''
    }, {
      label: '业务编码',
      key: 'name',
      value: ''
    }, {
      label: '事项类型',
      key: 'name',
      value: ''
    }, {
      label: '受理机构',
      key: 'name',
      value: ''
    }, {
      label: '办件类型',
      key: 'name',
      value: ''
    }, {
      label: '法定办结时限',
      key: 'name',
      value: ''
    }, {
      label: '承诺办结时限',
      key: 'name',
      value: ''
    }, {
      label: '网办深度',
      key: 'name',
      value: ''
    }]
  },
  approvalResult: {
    name: 'approvalResult',
    label: '审批结果',
    formItem: [{
      label: '审批结果',
      key: 'name',
      value: ''
    }, {
      label: '审批结果类型',
      key: 'name',
      value: ''
    }, {
      label: '审批不通过结果',
      key: 'name',
      value: ''
    }, {
      label: '审批不通过结果类型',
      key: 'name',
      value: ''
    }]
  },
  handProcess: {
    name: 'handProcess',
    label: '办理流程',
    formItem: [{
      label: '受理',
      key: 'name',
      value: ''
    }, {
      label: '审核',
      key: 'name',
      value: ''
    }, {
      label: '审批',
      key: 'name',
      value: ''
    }, {
      label: '办结',
      key: 'name',
      value: ''
    }, {
      label: '送达',
      key: 'name',
      value: ''
    }]
  },
  legalBasis: {
    name: 'legalBasis',
    label: '法定依据',
    formItem: [{
      label: '1',
      key: 'index',
      value: ''
    }]
  },
  applicationMaterials: {
    name: 'applicationMaterials',
    label: '申请材料',
    formItem: [{
      label: '1',
      key: 'index',
      value: ''
    }]
  }
})
let loading = ref(false)

// 切换tab
const guideTabHandle = (name) => {
  console.log('name', name)
  console.log('id', itemId)
  let data = {
    name: 'ce'
  }
  let formItem = guideTabPane.value[guideTab.value].formItem
  formItem.forEach(item => {
    item.value = data[item.key]
  })
}
// 返回
const backHandle = () => {
  router.go(-1)
}
</script>
<template>
  <div class='containerBox'>
    <div class='content'>
      <el-tabs v-model="guideTab" @tab-change="guideTabHandle" type="card">
        <el-tab-pane v-for='pane in guideTabPane' :key='pane.name' :name='pane.name' :label="pane.label"></el-tab-pane>
      </el-tabs>
      <div class='tabContent' v-loading='loading'>
        <div class="itemBox">
          <el-row type="flex" v-for="(colItem, colIndex) in guideTabPane[guideTab].formItem" :key="colIndex">
            <el-col :span="24" class="item">
              <div class="label">{{colItem.label}}</div>
              <div class="value" v-html="colItem.value"></div>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-row class='bottomBtn'>
        <el-col :span="24" align='center'>
          <el-button type='info' @click='backHandle'>返回</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style scoped lang='stylus'>
.content
  height 100%
.bottomBtn
  padding-top 20px
.tabContent
  height calc(100% - 60px - 60px)
  overflow auto
.itemBox
  border-top: 1px solid #e9eaed;
  border-left: 1px solid #e9eaed;
  .item
    display: flex;
    .label
      min-width: 200px;
      padding: 10px;
      border-right: 1px solid #e9eaed;
      border-bottom: 1px solid #e9eaed;
      background-color: #F0F9FF;
      box-sizing: border-box;
      display: flex;
      align-items: center
    .value
      padding: 10px;
      min-width: calc(100% - 200px);
      border-right: 1px solid #e9eaed;
      border-bottom: 1px solid #e9eaed;
      box-sizing: border-box;
      display: flex;
      align-items: center
</style>
