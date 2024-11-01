<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" headerTitle="金融产品")
    template(#main)
      ProductList(:institutionsId="institutionsId")
</template>

<script lang="ts">
import { defineComponent, onMounted, type Ref, ref } from 'vue'
import Layout from '@/components/layout/index.vue'
import ProductList from '@/components/c-product-list/index.vue'
import { onLoad } from '@dcloudio/uni-app'

export default defineComponent({
  name: 'FinanceProduct',
  components: { Layout, ProductList },
  setup(props) {
    const institutionsId: Ref<string> = ref('')
    onMounted(() => {})
    onLoad((options: any) => {
      institutionsId.value = options.institutionsId
    })
    return {
      institutionsId
    }
  }
})
</script>

<style lang="stylus" scoped></style>
