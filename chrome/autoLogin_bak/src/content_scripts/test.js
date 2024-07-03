// ==UserScript==
// @name         223.76.234.21系统脚本autoLogin
// @namespace    http://223.76.234.21:*/manager/index.html*
// @version      2024-06-05
// @description  try to take over the world!
// @author       You
// @match        http://223.76.234.21:*/manager/index.html*
// @icon         https://jrb.hubei.gov.cn/szxqyxyxx/enterprise/images/ico.png
// @grant        none
// ==/UserScript==

(function () {
  'use strict'
  const scriptText = `const inputElements = document.getElementsByClassName('el-input__inner')
  // 用户名
  const usernameInput = inputElements[0]
  usernameInput.value = 'shengjudfjr'
  usernameInput.dispatchEvent(new Event('input'))
  // 密码
  const passwordInput = inputElements[1]
  passwordInput.value = 'hbjr1234'
  passwordInput.dispatchEvent(new Event('input'))
  // 验证码
  const veryCodeInput = inputElements[2]
  // 创建一个 Blob 对象
  fetch('blob:http://223.76.234.21:83/0c7a1698-3d6f-4c7b-a31a-b0f232ece553')
    .then(response => response.blob())
    .then(blob => {
      // 使用 FileReader 读取 Blob 数据
      const reader = new FileReader()
      reader.onload = () => {
        // 读取完成后的回调函数
        const base64String = reader.result.split(',')[1] // 去除 data URL 的头部
        console.log(base64String) // 输出 base64 格式的字符串
        fetch('http://192.168.1.246:16002/jgmh/api/third/aliyun/recognitionCaptcha', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ imgBase64Data: base64String })
        }).then(response => {
          return response.json()
        }).then(result => {
          console.log('result', result)
          if (result.code === 0) {
            veryCodeInput.value = result.data
            veryCodeInput.dispatchEvent(new Event('input'))
            // 登录
            const loginButton = document.getElementsByClassName('el-button')[0]
            loginButton.click()
          }
        })
      }
      reader.readAsDataURL(blob) // 开始读取 Blob 数据
    })`

  // 创建一个新的script标签
  const script = document.createElement('script')
  script.textContent = scriptText
  // 将script标签添加到document的head中，执行代码
  document.head.appendChild(script)
})()