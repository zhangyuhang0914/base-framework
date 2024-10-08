/*
 * @Desc         : 自适应
 * @Autor        : ZYH
 * @Date         : 2023-02-08 09:51:42
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-02-08 10:40:22
 */

;(function flexible(window, document) {
  const docEl = document.documentElement
  const dpr = window.devicePixelRatio || 1

  // adjust body font size
  // function setBodyFontSize () {
  //   if (document.body) {
  //     document.body.style.fontSize = (12 * dpr) + 'px'
  //   }
  //   else {
  //     document.addEventListener('DOMContentLoaded', setBodyFontSize)
  //   }
  // }
  // setBodyFontSize();

  // set 1rem = viewWidth / 10
  function setRemUnit() {
    // var rem = docEl.clientWidth / 1920 < 1 ? 1 : docEl.clientWidth / 1920
    // docEl.style.fontSize = Math.min(rem * 16, 32) + 'px'
    docEl.style.fontSize = '16px'
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
    const fakeBody = document.createElement('body')
    const testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
})(window, document)
