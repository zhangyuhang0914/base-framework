export default {
  data () {
    return {
      share: {
        title: '四川机关事务局登录',
        path: '../pages/login/index',
        imageUrl: '',
        desc: '',
        content: '',
      }
    }
  },
  //分享到朋友或群
  onShareAppMessage (res) {
    return {
      title: this.share.title,
      path: this.share.path,
      imageUrl: this.share.imageUrl,
      desc: this.share.desc,
      content: this.share.content,
      success (res) {
        uni.showToast({
          title: '分享成功'
        })
      },
      fail (res) {
        uni.showToast({
          title: '分享失败',
          icon: 'none'
        })
      }
    }
  },
  //分享到朋友圈
  onShareTimeline (res) {
    return {
      title: this.share.title,
      path: this.share.path,
      imageUrl: this.share.imageUrl,
      desc: this.share.desc,
      content: this.share.content,
      success (res) {
        uni.showToast({
          title: '分享成功'
        })
      },
      fail (res) {
        uni.showToast({
          title: '分享失败',
          icon: 'none'
        })
      }
    }
  },
}
