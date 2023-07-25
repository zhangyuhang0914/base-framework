<template lang="pug">
.test-wrap
  .containerBox
    .title {{ '测试自然人和企业选择' }}
    .content
      .test-box(v-for="(item, index) in testPerson" :key="index" :class="item.customClass")
        .user-header
          img(:src="`${BASE_URL}${item.img}`")
          span {{ item.typeName }}
        .user-info
          .item-value
            .label {{ '姓名：' }}
            .value {{ item.name }}
          .item-value(v-if="item.type === '1'")
            .label {{ '性别：' }}
            .value {{ item.sex }}
          .card-value
            .label {{ '公民身份证号码：' }}
            .value {{ item.cardId }}
</template>

<script>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
export default {
  name: 'Test',
  setup() {
    const BASE_URL = import.meta.env.BASE_URL
    const testPerson = reactive([
      {
        id: 0,
        name: '张三',
        type: '1',
        typeName: '自然人',
        sex: '男',
        cardId: '420983201203239868',
        img: 'images/test/user.png',
        customClass: 'test-user'
      },
      {
        id: 1,
        name: '张三',
        type: '2',
        typeName: '企业',
        cardId: '420983201203239868',
        img: 'images/test/enterprise.png',
        customClass: 'test-enterprise'
      }
    ])
    onMounted(() => {})
    onUnmounted(() => {})
    return {
      BASE_URL,
      testPerson
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
