<script setup>
let uploadList = ref([{
  title: '超限运输车辆行驶公路许可申请表',
  needCopy: 1,
  A4Num: 0,
  remark: '无'
}, {
  title: ' 运输计划书',
  needCopy: 1,
  A4Num: 0,
  remark: '无'
}, {
  title: ' 运输计划书',
  needCopy: 1,
  A4Num: 0,
  remark: '无'
}, {
  title: ' 运输计划书',
  needCopy: 1,
  A4Num: 0,
  remark: '无'
}])
const props = defineProps({
  // 事项id
  itemId: {
    type: String,
    default: ''
  }
})
</script>
<template>
  <div class='step3'>
    <div class='stepBox'>
      <div class='main'>
        <div class='uploadList'>
          <div v-for='(item, index) in uploadList' :key='index' class='uploadItem'>
            <div class='index'>
              {{index + 1}}
            </div>
            <div class='title'>
              <div class='topTitle'>{{item.title}}</div>
              <div class='bottomNum'>
                <span class='mr20'>是否需要原件：{{item.needCopy}}</span>
                <span class='mr20'>复印件份数（A4纸）：{{item.A4Num}}</span>
                <span>材料说明：{{item.remark}}</span>
              </div>
            </div>
            <div class='btn'>
              <el-button type='primary'>上传</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang='stylus'>
.step3
  height 100%
  .main
    height 100%
    overflow auto
    padding: 20px;
    box-sizing: border-box;
.uploadList
  .uploadItem
    display flex
    margin-bottom 20px
    .index
      width 50px
      font-size 30px
      color #FFFFFF
      text-align center
      background $button-primary
      border-radius var(--el-border-radius-base) 0px 0px var(--el-border-radius-base)
      display flex
      align-items: center;
      justify-content: center;
    .title
      width calc(100% - 140px)
      box-sizing border-box
      border 1px solid #D6DCE1
      border-left none
      border-radius 0px var(--el-border-radius-base) var(--el-border-radius-base) 0px
      background-color #FFFFFF
      .topTitle
        font-size 25px
        padding 5px 20px
        border-bottom 1px solid #D6DCE1
      .bottomNum
        background-color #F1F1F1
        padding 5px 20px
    .btn
      margin-left 10px
      :deep(.el-button)
        width 80px
        height 100%
.mr20
  margin-right 40px

</style>
