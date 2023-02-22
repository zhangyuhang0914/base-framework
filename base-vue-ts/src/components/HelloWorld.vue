<template lang="pug">
h1 {{ msg }}
.card
  button( type="button" @click="count++") count is {{ count }}
  p
    Edit
    code components/HelloWorld.Vue
    to test HMR
p
  Check out
  a(href="https://vuejs.org/guide/quick-start.html#local" target="_blank") {{ 'create-vue, the official Vue + Vite starter' }}
p
  Install
  a(href="https://github.com/johnsoncodehk/volar" target="_blank") Volar
  in your IDE for a better DX
p.read-the-docs Click on the Vite and Vue logos to learn more
ElButton(type="success") primary
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent ({
  props: {
    msg: {
      type: String,
      default: ''
    }
  },
  setup () {
    const count = ref(0)
    return {
      count
    }
  }
})
</script>

<style lang="stylus" scoped>
.read-the-docs
  color #888
</style>
