<script setup>
const router = useRouter()
const route = useRoute()
let title = route.query.title
let list = ref([{
  title: '港口经营许可-《港口经营许可证》到期换证'
}, {
  title: '港口经营许可-《港口经营许可证》变更'
}, {
  title: '港口经营许可-《港口经营许可证》变更'
}, {
  title: '港口经营许可-《港口经营许可证》变更'
}, {
  title: '港口经营许可-《港口经营许可证》变更'
}, {
  title: '港口经营许可-《港口经营许可证》变更'
}])
// 事项指南
const guideHandle = (item) => {
  router.push({
    name: 'ItemGuide',
    query: {
      itemId: item.id || '123'
    }
  })
}
// 自助办
const itemHandle = (item) => {
  router.push({
    name: 'ItemHandle',
    query: {
      itemId: item.id || '123'
    }
  })
}
// 返回
const backHandle = () => {
  router.go(-1)
}
</script>
<template>
  <div class='containerBox'>
    <div class='title'>{{title}}</div>
    <div class='content'>
      <ul>
        <li v-for='(item, index) in list' :key='index' class='listItem'>
          <div class='itemTitle textOverflow'>
            {{item.title}}
          </div>
          <div class='itemBtn'>
            <el-button type="primary" @click='guideHandle(item)'>指南</el-button>
            <el-button type="primary" @click='itemHandle(item)'>自助办</el-button>
          </div>
        </li>
      </ul>
    </div>
    <el-row class='bottomBtn'>
      <el-col :span="24" align='center'>
        <el-button type='primary' @click='backHandle'>返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<style scoped lang='stylus'>
.content
  padding-bottom 0px
  height calc(100% - 50px - 80px)
.listItem
  height 60px
  border-radius 4px 4px 4px 4px
  margin-bottom 20px
  padding 0px 20px
  border 1px solid #D6DCE1
  display flex
  align-items center
  justify-content: space-between
  .itemTitle
    width calc(100% - 200px)
  .itemBtn
    text-align center
.bottomBtn
  padding 20px 0px
</style>
