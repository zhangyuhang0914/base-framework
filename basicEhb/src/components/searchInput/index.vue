<template lang="pug">
vanSearch.customSearch(
  v-model="wordKey"
  :class="searchClass"
  :placeholder="placeholder"
  :shape="shape"
  autocomplete="off"
)
  template(#right-icon)
    .divider
    span(v-if="showSearchIcon" @click="handleSelect") {{ '搜索' }}
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SearchInput',
  props: {
    // 判断是否是地图搜索
    isMap: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入关键字'
    },
    shape: {
      type: String,
      default: 'square'
    },
    showSearchIcon: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select'],
  setup(props, { emit }) {
    const wordKey = ref('')
    const searchClass = computed(() => {
      return {
        [`${props.shape}Search`]: true,
        mapSearch: props.isMap
      }
    })
    const handleSelect = () => {
      emit('select', wordKey.value)
    }
    return {
      wordKey,
      searchClass,
      handleSelect
    }
  }
})
</script>

<style lang="scss" scoped>
.customSearch {
  width: 100%;
  background: transparent;
  :deep(.van-search__content) {
    .van-field__right-icon {
      position: relative;
      .divider {
        position: absolute;
        width: 1px;
        height: 100%;
        background: var(--van-text-color-3);
      }
      span {
        padding: 0 22px;
        color: $colorLink;
        font-weight: 500;
        line-height: $lineHeight36;
      }
    }
  }
}
.mapSearch {
  position: absolute;
  top: 0;
  z-index: 99999;
}
.squareSearch {
  :deep(.van-search__content) {
    border-radius: $borderRadius10;
  }
}
</style>
