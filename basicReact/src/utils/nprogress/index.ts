/*
 * @Author       : 超人
 * @Description  : 授人以渔，功德无量，利在千秋
 * @Date         : 2025-07-07 18:01:44
 * @LastEditTime : 2025-07-08 16:19:49
 */
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  // 动画方式
  easing: 'ease',
  // 递增进度条的速度
  speed: 1000,
  // 是否显示加载ico
  showSpinner: false,
  // 自动递增间隔
  trickleSpeed: 200,
  // 初始化时的最小百分比
  minimum: 0.3
})

export const nprogressStart = () => {
  NProgress.start()
}
export const nprogressDone = () => {
  NProgress.done()
}

export default NProgress
