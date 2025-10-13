/**
 * 鄂汇办存储相关API类型定义
 */

// 设置存储项选项类型
export interface SetItemOptions {
  // 存储的键，地市拼音简写加key,如：'wh'+key
  key: string
  // 存储的值
  value: string
}
// 获取存储项选项类型
export interface GetItemOptions {
  // 取数据的键,地市拼音简写加key,如：'wh'+key
  key: string
  // 成功的回调，返回值string类型
  success: (res: string) => void
}
// 删除存储项选项类型
export interface DeleteItemOptions {
  // 删除数据的键,地市拼音简写加key,如：'wh'+key
  key: string
}
// RSA加密选项类型
export interface EncryptOptions {
  // 明文
  str: string
  // 成功的回调，返回值string类型
  success: (res: string) => void
}
// RSA解密选项类型
export interface DecryptOptions {
  // 密文
  str: string
  // 成功的回调，返回值string类型
  success: (res: string) => void
}
// 保存base64图片选项类型
export interface SaveBase64PictureOptions {
  // 图片base64链接
  base64Url: string
}

// 鄂汇办存储接口类型定义
export interface EhbAppStorage {
  // 将数据存储到手机缓存中
  setItem: (options: SetItemOptions) => void
  // 从手机缓存中取数据
  getItem: (options: GetItemOptions) => void
  // 从手机缓存中删除数据
  deleteItem: (options: DeleteItemOptions) => void
  // RSA加密
  encrypt: (options: EncryptOptions) => void
  // RSA解密
  decrypt: (options: DecryptOptions) => void
  // 保存base64图片
  saveBase64Picture: (options: SaveBase64PictureOptions) => void
}
