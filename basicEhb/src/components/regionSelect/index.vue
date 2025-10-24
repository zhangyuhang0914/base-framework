<template lang="pug">
VanActionSheet(
  v-model:show="actionSheetShow" 
  title="请选择办理地区"
  :style="{ height: '80%' }"
)
  .stepsContainer
    VanSteps(
      direction="vertical" 
      :active="selectIndex" 
      :class="stepsArea.length <= 1 ? 'hideSteps' : 'showSteps'" 
      @click-step="handleClickSteps"
    )
      VanStep(
        v-for="(item, index) in stepsArea" 
        :key="index" 
        :class="selectIndex === index ? 'stepActive' : 'stepDefault'"
      )
        .stepName {{ item.name || '' }}
        .stepTips(
          v-if="item.grade === '2' && selectIndex === index"
        ) {{ '省本级' }}
        .stepTips(
          v-else-if="item.grade === '3' && selectIndex === index"
        ) {{ '市本级' }}
        .stepNoService(
          v-if="item.show === '2' && selectIndex === index && item.grade !== '5'"
        ) {{ '暂未开通,下级可选' }}
        VanButton.stepBtn(
          v-if="selectIndex === index" 
          :disabled="item.show === '2'" 
          type="info" 
          @click="confirm"
        ) {{ '确定' }}
    .areaContent
      .areaHeader {{ areaTitle }}
      .areaList(v-if="areaList.length")
        .cAreaBox(
          v-for="(item, index) in areaList" 
          :key="index" 
          @click="handleClickCity(item, index)"
        )
          .cName(v-if="item.show !== '0'") {{ item.name || '' }}
          .cNoName(v-else) {{ `${item.name}（未开通）` }}
      .areaNoData(v-else) {{ '没有更多了' }}
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRegionSelect } from '@/hooks/useRegionSelect'

export default defineComponent({
  name: 'RegionSelect',
  setup(props, context) {
    const {
      actionSheetShow,
      stepsArea,
      selectIndex,
      areaList,
      handleClickCity,
      handleClickSteps,
      confirm,
      openActiveSheet
    } = useRegionSelect()
    const areaTitle = computed(() => {
      const currentStep = stepsArea.value[selectIndex.value]
      if (!currentStep) return '选择城市'
      const grade = currentStep.grade
      switch (grade) {
        case '2': // 省级
          return '选择城市'
        case '3': // 市级
          return '选择区县'
        case '4': // 区县级
          return '选择乡镇/街道'
        case '5': // 乡镇级
          return '选择社区/村'
        default:
          return '选择城市'
      }
    })
    // 暴露方法给父组件
    return {
      actionSheetShow,
      stepsArea,
      selectIndex,
      areaList,
      areaTitle,
      handleClickCity,
      handleClickSteps,
      confirm,
      openActiveSheet
    }
  }
})
</script>

<style lang="scss">
.van-popup {
  border-radius: $borderRadius10 !important;
  .van-action-sheet__header {
    color: $colorBlack;
    text-align: left;
    text-indent: 40px;
    background: #f9f9f9;
    font-size: $fontSize34;
    font-weight: bold;
    & > i {
      color: $colorBlack;
    }
  }
  .van-action-sheet__content {
    .stepsContainer {
      .hideSteps,
      .showSteps {
        width: 100%;
        min-height: 104px;
        padding: 0 0 32px 72px !important;
        background: $colorWhite;
        .van-steps__items {
          // 默认
          .van-step--vertical {
            height: 72px;
            .van-step__title {
              height: 100%;
              position: relative;
              @include flexBetween;
              align-items: center;
              .stepName {
                font-size: $fontSize32;
                color: #445fcd !important;
              }
              .stepTips {
                height: 40px;
                @include flexCenter;
                color: #445fcd !important;
                background: #e5e7f6;
                border-radius: $borderRadius4;
                position: absolute;
                top: 12px;
                left: 18%;
                font-size: $fontSize28;
                padding: 0 10px;
                &::before {
                  position: absolute;
                  top: 32%;
                  left: -16px;
                  content: '';
                  border: 8px solid transparent;
                  border-right-color: #e5e7f6;
                }
              }
              .stepNoService {
                height: 40px;
                color: #9f9fa1;
                background: #f0eff4;
                @include flexCenter;
                position: relative;
                top: 2px;
                left: 48px;
                padding: 0 6px;
              }
              .stepBtn {
                height: 56px !important;
                padding: 0 36px;
                margin-right: 16px;
                background-color: #4460cd;
                border: none;
                border-color: #4460cd;
                color: $colorWhite;
                border-radius: $borderRadius4;
                font-size: $fontSize28;
              }
            }
            .van-step__circle-container {
              top: 50px !important;
              & > i {
                font-size: 36px;
                color: #445fcd !important;
              }
            }
            .van-step__circle-container {
              .van-step__circle {
                background-color: #d9d9d9 !important;
              }
            }
            .van-step__line {
              top: 50px !important;
              background-color: #d9d9d9 !important;
            }
          }
          // 已选未激活
          .stepDefault {
            .van-step__title {
              position: relative;
              @include flexBetween;
              align-items: center;
              .stepName {
                position: relative;
                top: 12px;
                color: $colorBlack;
              }
              .stepTips {
                height: 40px;
                @include flexCenter;
                color: #445fcd !important;
                background: #e5e7f6;
                border-radius: $borderRadius4;
                position: absolute;
                top: 12px;
                left: 18%;
                font-size: $fontSize28;
                padding: 0 10px;
                &::before {
                  position: absolute;
                  top: 32%;
                  left: -16px;
                  content: '';
                  border: 8px solid transparent;
                  border-right-color: #e5e7f6;
                }
              }
              .stepNoService {
                height: 40px;
                color: #9f9fa1;
                background: #f0eff4;
                @include flexCenter;
                position: relative;
                top: 2px;
                left: 48px;
                padding: 0 6px;
              }
              .stepBtn {
                height: 60px !important;
                padding: 0 36px;
                margin-right: 16px;
                background-color: #4460cd;
                border: none;
                border-color: #4460cd;
                color: $colorWhite;
                border-radius: $borderRadius4;
                font-size: $fontSize28;
              }
            }
          }
          // 已选已激活
          .stepActive {
            .van-step__title {
              position: relative;
              @include flexBetween;
              align-items: center;
              .stepName {
                position: relative;
                top: 12px;
              }
            }
          }
          // 未选中
          .van-step--finish {
            .van-step__title {
              position: relative;
              @include flexBetween;
              align-items: center;
              .stepName {
                color: $colorBlack;
              }
              .stepTips {
                height: 40px;
                @include flexCenter;
                color: #445fcd !important;
                background: #e5e7f6;
                border-radius: $borderRadius4;
                position: absolute;
                top: 12px;
                left: 18%;
                font-size: $fontSize28;
                padding: 0 10px;
                &::before {
                  position: absolute;
                  top: 32%;
                  left: -16px;
                  content: '';
                  border: 8px solid transparent;
                  border-right-color: #e5e7f6;
                }
              }
              .stepNoService {
                height: 40px;
                color: #9f9fa1;
                background: #f0eff4;
                @include flexCenter;
                position: relative;
                top: 2px;
                left: 48px;
                padding: 0 6px;
              }
              .stepBtn {
                height: 60px !important;
                padding: 0 36px;
                margin-right: 16px;
                background-color: #4460cd;
                border: none;
                border-color: #4460cd;
                color: $colorWhite;
                border-radius: $borderRadius4;
                font-size: $fontSize28;
              }
            }
          }
        }
      }
      .areaContent {
        @include flexColumn;
        padding: 10px 36px;
        background: #f9f9f9;
        .areaHeader {
          font-size: $fontSize34;
          color: $colorBlack;
          font-weight: bold;
          padding: 20px 0;
        }
        .areaList {
          font-size: $fontSize32;
          line-height: $lineHeight72;
          .cAreaBox {
            .cName {
              color: $colorDefault;
            }
            .cNoName {
              color: #c6c6c8 !important;
            }
          }
        }
        .areaNoData {
          color: #c1c1c3;
          font-size: $fontSize30;
        }
      }
    }
  }
}
</style>
