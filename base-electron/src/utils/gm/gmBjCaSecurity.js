/* eslint-disable */
var certID
var deviceSn
var userCertName
import xtxsync from './xtxsync'
export function loadCaCert() {
  let userListStr = xtxsync.SOF_GetUserList()
  if (!userListStr || userListStr === '') {
    jr.alertWarn('未识别到u盾证书，请正确插入USB_KEY设备，并保持证书助手开启！')
    return false
  }
  let userList = userListStr.split('&&&').filter(item => item != '')
  if (userList.length > 1) {
    jr.alertWarn(
      '请正确插入需要进行登陆的USB_KEY设备，移除其他设备，避免造成干扰！'
    )
    return false
  }
  let strOneUser = userList[0]
  userCertName = strOneUser.substring(0, strOneUser.indexOf('||'))
  certID = strOneUser.substring(strOneUser.indexOf('||') + 2, strOneUser.length)
  var strDeviceList = xtxsync.GetAllDeviceSN()
  deviceSn = strDeviceList.substring(0, strDeviceList.indexOf(';'))
  console.log('UKey加载完成')
  return true
}

/**
 * 获取版本号
 * @returns {*}
 */
export function getVersion() {
  return xtxsync.SOF_GetVersion()
}

/**
 * 导出签名证书
 * @returns {*}
 */
export function exportSignCert() {
  return xtxsync.SOF_ExportUserCert(certID)
}

/**
 * 导出加密证书
 * @returns {*}
 */
export function exportEncryptCert() {
  return xtxsync.SOF_ExportExChangeUserCert(certID)
}

/**
 * 获取随机数
 * @param len
 * @returns {*}
 * @constructor
 */
export function getCaRandom(len) {
  return xtxsync.SOF_GenRandom(Number(len))
}

/**
 * 签名
 * @constructor
 */
export function caSignData(plain) {
  if (certID == '') {
    return
  }
  if (plain == '') {
    alert('请指定待签名的原文数据!')
    return
  }
  var sig = xtxsync.SOF_SignData(certID, plain)
  if (sig == '') {
    alert('签名失败!请尝试重新插入UKey或联系管理员。')
    return
  }
  return sig
}

/**
 * PKCS7签名
 * @param plain
 * @returns {*}
 */
export function caSignMessage(plain) {
  if (certID == '') {
    return
  }
  if (plain == '') {
    alert('请指定待签名的原文数据!请尝试重新插入UKey或联系管理员。')
    return
  }
  var isDetach = 0

  var doFunc = xtxsync.SOF_SignMessage

  var sig = doFunc(isDetach, certID, plain)
  if (sig == '') {
    alert('PKCS7签名失败!')
    return
  }
  return sig
}
