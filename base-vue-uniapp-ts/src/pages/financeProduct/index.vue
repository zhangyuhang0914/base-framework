<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" headerTitle="金融产品")
    template(#main)
      ProductList(ref="productListRef")
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Layout from '@/components/layout/index.vue'
import ProductList from '@/components/c-product-list/index.vue'
import Bus, { GLOBAL_SEARCH } from '@/common/bus'
import { onShow } from '@dcloudio/uni-app'
interface GLOBAL_SEARCH_TYPE {
  searchType: string
  keyword: string
}
export default defineComponent({
  name: 'FinanceProduct',
  components: { Layout, ProductList },
  setup(props) {
    const productListRef = ref(null)
    // 隐藏小程序后会自动销毁
    onShow(() => {
      Bus.$on(GLOBAL_SEARCH, (data: GLOBAL_SEARCH_TYPE) => {
        console.log('GLOBAL_SEARCH', data.searchType, data.keyword)
        if (data.searchType === 'product') {
          // @ts-ignore
          productListRef.value && productListRef.value?.propsSearchHandle(data.keyword)
        }
      })
    })
    return {
      productListRef
    }
  }
})
</script>

<style lang="stylus" scoped></style>
