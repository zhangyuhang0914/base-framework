/*
 * @Desc         : 自适应
 * @Author       : ZhangYuHang
 * @Date         : 2023-08-09 16:42:48
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-08-09 16:42:48
 */
;(function flexible(window, document) {
  var docEl = document.documentElement
  var dpr = window.devicePixelRatio || 1

  function setRemUnit() {
    let clientW = docEl.clientWidth
    let clientH = docEl.clientHeight
    let rat = 16 / 9
    clientW = clientW / clientH > rat ? clientH * rat : clientW
    let rem = clientW / 1200
    if (clientW < 700) {
      rem = clientW / 1200 < 0.8 ? 0.8 : clientW / 1200
    } else if (clientW <= 820) {
      rem = 0.8
    } else if (clientW <= 1000) {
      rem = clientW / 1000
    } else if (clientW > 1000 && clientW <= 1920) {
      rem = 1
    } else if (clientW > 1920) {
      rem = clientW / 1920
    }
    // < 1 ? 1 : docEl.clientWidth / 1200
    // rem = rem < 0.5 ? 0.5 : rem
    docEl.style.fontSize = Math.min(rem * 16, 32) + 'px'
    // docEl.style.fontSize = '16px'
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
})(window, document)
