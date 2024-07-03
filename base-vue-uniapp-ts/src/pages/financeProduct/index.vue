<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar headerBackground="#DAECFE" statusBackground="#DAECFE" headerTitle="金融产品")
    template(#main)
      ProductList
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import Layout from '@/components/layout/index.vue'
import ProductList from '@/components/c-product-list/index.vue'

export default defineComponent({
  name: 'FinanceProduct',
  components: { Layout, ProductList },
  setup(props) {
    onMounted(() => {})
    return {}
  }
})
</script>

<style lang="stylus" scoped></style>
