<template lang="pug">
.login-wrap
  .containerBox
    .title {{ '选择登录方式' }}
    .content
      .login-box(v-for="(item, index) in loginPage" :key="index" :class="item.customClass" @click="loginFn(item)")
        .show-image
          img(:src="`${BASE_URL}${item.imagesUrl}`")
        .title-box {{ item.label }}
  .test-inlet(@click="toggleHidden")
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: 'Login',
  setup() {
    const BASE_URL = import.meta.env.BASE_URL
    const router = useRouter()
    const loginPage = reactive([
      {
        customClass: 'card-login',
        label: '自然人身份证登录',
        imagesUrl: 'images/login/card-login.png',
        type: 0,
        urlName: 'CardLogin'
      },
      {
        customClass: 'user-ehb-login',
        label: '自然人身份证登录',
        imagesUrl: 'images/login/user-ehb-login.png',
        type: 1,
        urlName: 'EhbLogin'
      },
      {
        customClass: 'enterprise-ehb-login',
        label: '企业法人鄂汇办扫码登录',
        imagesUrl: 'images/login/enterprise-ehb-login.png',
        type: 2,
        urlName: 'EhbLogin'
      }
    ])
    const counter = ref(0)
    const loginFn = item => {
      const type = item.type
      if (type === 0) {
        router.push({
          name: item.urlName
        })
      } else {
        router.push({
          name: item.urlName,
          params: {
            type: item.type
          }
        })
      }
    }
    const toggleHidden = () => {
      counter.value += 1
      if (counter.value === 5) {
        router.push({
          name: 'Test'
        })
      }
    }
    onMounted(() => {})
    return {
      BASE_URL,
      loginPage,
      loginFn,
      toggleHidden
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
