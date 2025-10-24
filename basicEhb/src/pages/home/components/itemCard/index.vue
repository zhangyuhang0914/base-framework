<template lang="pug">
.templateCard
  .cardHeader
    .cardLeftMenu
      .cardIcon
      .cardTitle {{ title }}
    .cardRightMore(v-if="showMore" @click="$emit('more')")
      span {{ '查看更多' }}
      ChevronRight(:size="22")
  .cardBody
    slot(name="content")
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ChevronRight } from 'lucide-vue-next'

export default defineComponent({
  name: 'ItemCard',
  components: { ChevronRight },
  props: {
    title: {
      type: String,
      default: ''
    },
    showMore: {
      type: Boolean,
      default: false
    }
  },
  emits: ['more'],
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.templateCard {
  .cardHeader {
    height: 100px;
    padding: 0 21px 0 30px;
    background: linear-gradient(90deg, #3d96e9, #5a75d0);
    border-radius: $borderRadius24 $borderRadius24 0 0;
    @include flexBetween;
    .cardLeftMenu {
      @include flexAlignCenter;
      .cardIcon {
        width: 8px;
        height: 24px;
        background: #ffaf15;
        border-radius: $borderRadius4;
      }
      .cardTitle {
        padding-left: 20px;
        font-size: $fontSize36;
        font-weight: 700;
        color: $colorWhite;
      }
    }
    .cardRightMore {
      @include flexAlignCenter;
      font-size: $fontSize28;
      color: $colorWhite;
    }
  }
  .cardBody {
    background: $colorWhite;
    border-radius: 0 0 $borderRadius24 $borderRadius24;
  }
}
</style>
