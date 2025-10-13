/**
 * 鄂汇办媒体相关API类型定义
 */

// 调用手机拍照功能
export interface TakePhotoOptions {
  // 上传图像的接口，接收字段:file（前端不用传，原生底层封装了），接收类型：MultipartFile
  url: string
  // cameraFront: 前置摄像头， cameraRear: 后置摄像头
  cameraType?: 'cameraFront' | 'cameraRear'
  // ‘1’: 裁剪 ‘2’: 不裁剪
  cropType?: '1' | '2'
  // ‘0’: 上传到后台 ‘1’: 直接返回base64格式
  returnType?: '0' | '1'
  // 是否需要token，yes：需要 no:不需要
  needToken?: 'yes' | 'no'
  // 成功的回调，返回值json字符串
  success: (res: {
    // 上传图片路径
    path: string
  }) => void
}
// 相册选项类型
export interface PhotoAlbumOptions {
  // 上传图像的接口，接收字段:file（前端不用传，原生底层封装了），接收类型：MultipartFile
  url: string
  // ‘1’: 裁剪 ‘2’: 不裁剪
  cropType?: '1' | '2'
  // ‘0’: 上传到后台 ‘1’: 直接返回base64格式
  returnType?: '0' | '1'
  // 是否需要token，yes：需要 no:不需要
  needToken?: 'yes' | 'no'
  // 成功的回调，返回值json字符串
  success: (res: {
    // 上传图片路径
    path: string
  }) => void
}

// 鄂汇办媒体接口类型定义
export interface EhbAppMedia {
  // 调用手机拍照功能
  takePhoto: (options: TakePhotoOptions) => void
  // 相册
  photoAlbum: (options: PhotoAlbumOptions) => void
}
