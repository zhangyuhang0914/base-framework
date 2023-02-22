
const debounce = (fn, delay) => {
  var timer // 维护一个 timer
  return function () {
    var _this = this // 取debounce执行作用域的this
    var args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      fn.apply(_this, args) // 用apply指向调用debounce的对象，相当于_this.fn(args);
    }, delay)
  }
}
const transform = (width, height) => {
  const resize = () => {
    const body = document.body
    const ratioX = window.innerWidth / width
    const ratioY = window.innerHeight / height
    body.style.width = width + 'px'
    body.style.height = height + 'px'
    body.style.transform = 'scale(' + ratioX + ',' + ratioY + ')'
    body.style.transformOrigin = 'left top'
    body.style.backgroundSize = '100% 100%'
  }
  resize()
  document.documentElement.style.overflow = 'hidden'
  window.onresize = debounce(resize, 500)
}

// export default transform
