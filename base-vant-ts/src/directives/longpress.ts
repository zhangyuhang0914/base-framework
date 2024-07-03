export default {
  async mounted(el: any, binding: any, vnode?: any) {
    const cb = binding.value
    if (typeof cb !== 'function') {
      console.error('longpress need Function!')
      return false
    }
    let timer: any = null
    // 重置计时器
    const cancel = (e: any) => {
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }
    }
    const end = (e: any) => {
      cancel(e)
      // e.preventDefault()
    }
    el.addEventListener('touchstart', (e: any) => {
      // 以防影响正常的滚动
      // e.preventDefault()
      if (timer === null) {
        timer = setTimeout(() => {
          cb(e)
          timer = null
        }, 1000)
      }
    })

    el.addEventListener('touchmove', cancel)
    el.addEventListener('touchend', end)
    // or - 长按后移出元素外是否还有效
    // el.addEventListener('mouseup', cancel)
  },
  unmounted(el: any, binding: any, vnode?: any) {
    el.removeEventListener('touchstart', () => {})
    el.removeEventListener('touchmove', () => {})
    el.removeEventListener('touchend', () => {})
  }
}
