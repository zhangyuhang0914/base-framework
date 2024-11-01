import { reactive } from 'vue'

interface ShareInfoType {
  /**
   * 标题
   */
  title: string
  /**
   * 进入路径
   */
  path: string
  /**
   * 封面图片路径
   */
  imageUrl: string
}

const shareInfo: ShareInfoType = reactive({
  title: '湖北省·中小企业融资信用平台',
  path: '/pages/index/index',
  imageUrl: 'http://jrb.hubei.gov.cn/jrrz/xzs/ptsy/202309/W020230907689921663161.jpg'
})

const UniShare = {
  //分享到朋友或群
  onShareAppMessage(res: any) {
    return {
      title: shareInfo.title,
      path: shareInfo.path,
      imageUrl: shareInfo.imageUrl,
      success(res: any) {},
      fail(res: any) {}
    }
  },
  //分享到朋友圈
  onShareTimeline(res: any) {
    return {
      title: shareInfo.title,
      path: shareInfo.path,
      imageUrl: shareInfo.imageUrl,
      success(res: any) {},
      fail(res: any) {}
    }
  }
}

export default UniShare
