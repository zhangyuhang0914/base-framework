export interface FaceAuthVerifyType {
  name: string
  idCardNumber: string
}

export interface CheckIsSupportFacialRecognitionOptionsType {
  errMsg: string
  /**
   * 0: 支持人脸采集
   * 10001: 不支持人脸采集：设备没有前置摄像头
   * 10002: 不支持人脸采集：没有下载到必要模型
   * 10003: 不支持人脸采集：后台控制不支持
   */
  errCode: 0 | 10001 | 10002 | 10003
}
