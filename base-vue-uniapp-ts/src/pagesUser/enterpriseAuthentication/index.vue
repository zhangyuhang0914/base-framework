<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack statusBackground="#132B5B" headerBackground="#132B5B" headerColor="#FFFFFF" headerTitle="绑定企业信息")
    template(#main)
      view.layoutMain
        .mainContainer
          scroll-view.scrollView(scroll-y)
            view.upFormBox
              up-form(labelPosition="left" labelWidth='120')
                up-form-item(label="企业已在统一身份认证平台注册" labelWidth='240')
                  .formItemH50
                    up-radio-group(v-model="hasRegister")
                      up-radio(
                        label="是"
                        name="true"
                        activeColor="#4C5F99"
                        :customStyle="{marginRight: '30rpx'}")
                      up-radio(
                        label="否"
                        activeColor="#4C5F99"
                        name="false")
              BindForm.formContent(v-if="hasRegister === 'true'")
              RegisterForm.formContent(v-if="hasRegister === 'false'")
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import { ref } from 'vue'
import BindForm from './bindForm/index.vue'
import RegisterForm from './registerForm/index.vue'
const hasRegister = ref<string>('true')
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
