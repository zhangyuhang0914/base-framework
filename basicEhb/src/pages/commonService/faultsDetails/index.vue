<template lang="pug">
.pageWrapper
  .faultsInfo
    VanImage.imageLogo(width="63" height="auto" :src="getImage('governmentService.faultsLogo')" fit="contain")
    .iHeader
      VanImage.iconQuestion(width="40" height="40" :src="getImage('common.iconQuestion')" fit="contain")
      .title {{ faultsInfo.title }}
    .connectLine
      VanImage.leftIcon(width="20" height="50" :src="getImage('governmentService.iconFaultsLine')" fit="contain")
      VanImage.rightIcon(width="20" height="50" :src="getImage('governmentService.iconFaultsLine')" fit="contain")
  .faultsSteps
    .stepTitle
      VanImage.leftIcon(width="12" height="20" :src="getImage('common.iconFaults')" fit="contain")
      .title {{ '自助排障' }}
    .stepsContent
      .describe(v-html="faultsInfo.describe")
      .tips {{ '*如仍无法解决问题，请及时进行故障报修。' }}
    //- VanSteps.steps(direction="vertical")
    //-   VanStep(v-for="(item, index) in faultsInfo.steps" :key="index")
    //-     template(#active-icon)
    //-       .iconCircle
    //-     template(#inactive-icon)
    //-       .iconCircle
    //-     template(#default)
    //-       .stepIndex {{ getStepText(index) }}
    //-       .stepName {{ item.describe }}
    .contactCustomerService
      VanButton.oBtn(@click="handleMaintain") {{ '未解决，我要报修' }}
</template>

<script lang="ts">
import { getImage } from '@/constants/images'
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'FaultsDetails',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const id = ref(route.query.id)
    const faultsInfo = ref({})
    const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
    // 获取故障详情
    const getDetailInfo = () => {
      faultsInfo.value = {
        id: id.value,
        title: '无线对讲系统设备中继台在安装调试过程中容易出现的问题以及解决方法?',
        describe: `<div data-v-9cd345ad="" style="padding-bottom: 20px;">1、重新规划天线位置：检查中继台的天线安装位置，确保其位置合适，能够最大程度地覆盖到需要的区域。</div><div data-v-9cd345ad="" style="padding-bottom: 20px;">2、增加天线增益：如条件允许，可考虑更换天线或增加天线的增益，以提高信号覆盖范围。</div><div data-v-9cd345ad="" style="padding-bottom: 20px;">3、调整频率和功率：对中继台进行频率和功率的调整，使其能够更好地覆盖到需要的区域。</div>`,
        steps: [
          {
            describe:
              '确认是否已到期：检查订购的节目是否已过有效期，若需续费，请前往营业厅或在线支付平台进行操作。'
          },
          {
            describe:
              '联系客服刷新授权：若在续费后，机顶盒未及时开机接收授权信号，可拨打客服热线进行刷新。'
          },
          {
            describe: '检查配件是否磨损、配件是否需要更换。'
          }
        ]
      }
    }
    // 获取映射步骤文本
    const getStepText = (index: number): string => {
      // 若步骤数超过映射数组长度，降级显示“第N步”（N为数字）
      if (index > chineseNumbers.length - 1) {
        return `第${index}步`
      }
      return `第${chineseNumbers[index]}步`
    }
    // 我要报修
    const handleMaintain = () => {
      router.push({
        name: 'MaintenanceApply'
      })
    }
    // 打电话
    const callPhone = () => {
      ehbAppJssdk.notice.confirm({
        title: '提示',
        message: '是否拨打客服热线？',
        buttonLabels: ['取消', '拨打'],
        success: result => {
          const resultData = JSON.parse(result)
          if (resultData.buttonIndex === 1) {
            ehbAppJssdk.device.call({
              phone: '17607158394',
              success: () => {}
            })
          }
        }
      })
    }
    onMounted(() => {
      getDetailInfo()
    })
    return {
      faultsInfo,
      getImage,
      getStepText,
      callPhone,
      handleMaintain
    }
  }
})
</script>

<style lang="scss" scoped>
.pageWrapper {
  flex: 1;
  height: 100%;
  padding: 30px;
  background: $backgroundDefault;
  @include flexColumn;
  gap: $gap20;
  .faultsInfo {
    position: relative;
    padding: 24px 30px 56px 30px;
    background: linear-gradient(180deg, #cfe4ff 5%, #ffffff 35%);
    border-radius: $borderRadius24;
    @include flexColumnCenter;
    gap: $gap10;
    .iHeader {
      @include flexAlignStart;
      .title {
        padding: 12px 24px;
        font-size: $fontSize30;
        font-weight: 700;
        line-height: $lineHeight40;
      }
    }
    .connectLine {
      position: absolute;
      left: 0;
      bottom: -56px;
      width: 100%;
      padding: 0 26px 0 26px;
      @include flexBetween;
    }
  }
  .faultsSteps {
    flex: 1;
    padding: 64px 30px 24px 30px;
    background: $colorWhite;
    border-radius: $borderRadius24;
    .stepTitle {
      @include flexJustifyStart;
      .title {
        padding: 0 12px;
        font-size: $fontSize36;
        font-weight: 700;
        color: $colorDefault;
      }
    }
    .stepsContent {
      position: relative;
      margin: 24px 0;
      padding: 30px;
      font-size: $fontSize26;
      font-weight: 700;
      line-height: $lineHeight38;
      background: #f0f7ff;
      border-radius: $borderRadius10;
      text-align: justify;
      .tips {
        padding-top: 12px;
        font-size: $fontSize24;
        color: #248efe;
      }
    }
    .steps {
      :deep(.van-steps__items) {
        .van-step__title {
          position: relative;
          top: -6px;
          .stepIndex {
            padding: 0 0 12px 0;
            color: $colorLink;
            font-size: $fontSize30;
            font-weight: 900;
            line-height: $lineHeight42;
          }
          .stepName {
            padding: 16px 24px;
            background: #f0f7ff;
            border-radius: $borderRadius10;
            color: $colorDefault;
            font-size: $fontSize28;
            font-weight: 500;
            line-height: $lineHeight40;
            text-align: justify;
          }
        }
        .van-step__circle-container {
          .iconCircle {
            width: 24px;
            height: 24px;
            border: 6px solid $colorLink;
            background: $colorWhite;
            border-radius: $borderRadiusCircle;
          }
        }
        .van-step__line {
          background: repeating-linear-gradient(
            to bottom,
            $colorLink,
            $colorLink 0.5px,
            transparent 0.5px,
            transparent 1px
          );
        }
      }
    }
    .contactCustomerService {
      padding: 24px 0;
      @include flexCenter;
      .oBtn {
        width: 55%;
        background: linear-gradient(90deg, #3d96e9, #5a75d0);
        border: $borderNone;
        border-radius: $borderRadius46;
        color: $colorWhite;
        font-size: $fontSize30;
        font-weight: 500;
        line-height: $lineHeight36;
      }
    }
  }
}
</style>
