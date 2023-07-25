<script setup>
import VueEsign from '../../../components/VueEsign.vue'
const router = useRouter()
let esignImg = ref('')
let esignPane = ref(false) // 电子签名面板
let vueEsignRef = ref(null)
const props = defineProps({
  // 事项id
  itemId: {
    type: String,
    default: ''
  }
})
// 签名
const esignHandle = () => {
  esignPane.value = true
  nextTick(() => {
    vueEsignRef.value.init()
  })
}
// 签名成功回调
const handleGenerate = (res) => {
  esignPane.value = false
  esignImg.value = res
}
defineExpose({ esignImg })
</script>
<template>
  <div class='step1'>
    <div class='stepBox'>
      <div class='main'>
        <p class='mb30px'>我单位（本人）经审慎研究， 郑重作出以下承诺：</p>
        <p>1. 本单位（本人）严格依照国家和湖北省相关法律、法规、规章、规范性文件，全面履行应尽的责任和义务；</p>
        <p>2. 本单位（本人）所提交的相关申报材料，均合法、真实、准确、有效，无任何伪造、修改、虚假成份，并对所提供资料的真实性负责；</p>
        <p>3. 本单位（本人）自觉接受政府、行业组织、社会公众新闻與论的监督；</p>
        <p>4. 本单位（本人）在信用中国（湖北）网站中无违法违规、较重或严重失信记录；</p>
        <p class='mb30px'>5. 本单位（本人）自愿接受行政监督部门的依法检查。若违背承诺约定，经查实，愿意接受行业主管部门相应处罚，承担违约责任，并依法承担相应的法律责任。按照《湖北省社会信用信息管理条例》规定，自愿将违背承诺约定行为作为失信信息，记录到省社会信用信息服务平台并予以公开。</p>
        <p>特此承诺。</p>
      </div>
    </div>
    <div class='esignbox'>
      <span>签名</span>
      <div class='esignInput'>
        <img v-if='esignImg' :src="esignImg"/>
      </div>
      <div class='esignIcon'  @click='esignHandle'></div>
    </div>
    <!--电子签名-->
    <div v-show='esignPane' class='esignPane'>
      <VueEsign
        ref='vueEsignRef'
        @handleGenerate='handleGenerate'>
      </VueEsign>
    </div>
  </div>
</template>
<style scoped lang='stylus'>
.step1
  height 100%
.stepBox
  height calc(100% - 70px) !important
  .main
    height 100%
    overflow auto
    padding: 20px;
    box-sizing: border-box;
  .mb30px
    margin-bottom 30px
.esignbox
  font-size 20px
  display flex
  height 40px
  padding  20px 0px 10px 0px
  align-items center
  .esignInput
    width: 300px;
    height: 40px;
    border-radius: 6px;
    box-shadow: 0 0px 7px 0 #00000033;
    background: #ffffff;
    box-sizing border-box
    margin-left 20px
    img
      width 100%
      height 100%
      border-radius: 6px
  .esignIcon
    width 40px
    min-width 40px
    height 40px
    background $theme-color url("/images/setting/esign.png") no-repeat center center
    background-size 20px 20px
    border-radius 50%
    margin-left 20px
    cursor pointer
.esignPane
  position absolute
  top 20px
  bottom 20px
  left 20px
  right 20px
  background #FFFFFF
  z-index 2
</style>
