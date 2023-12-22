export default {
  async mounted(el:any, binding: any) {
    el.outFn = (e: any) => {
      !(el.contains(e.target)) && binding.value();
    }
    // 添加监听，点击外面关闭
    document.addEventListener('click', el.outFn, true)
  },
  unmounted(el:any, binding: any) {
    document.removeEventListener('click', el.outFn, true)
  }
}
