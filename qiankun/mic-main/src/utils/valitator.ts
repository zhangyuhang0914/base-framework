'use strict'

const REGEXP = {
  CELLPHONE: /^0?(1[3-9][0-9]|0?85[23])[0-9]{8}$/, // 手机号码
  PHONE: /^([0-9]{3,4}(-\|)?)?[0-9]{7,8}$/, // 电话号
  EMAIL:
    /^[a-z0-9A-Z]+([._\\-]*[a-z0-9A-Z])*@([a-z0-9A-Z]+[-a-z0-9A-Z]*[a-z0-9A-Z]+.){1,63}[a-z0-9A-Z]+$/, // 邮箱
  NUMBER: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,
  PASSWORD:
    /^(?!.*\s)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[,.#?!@$%^&*-]).{8,18}$/,
  INTEGER: /^\d+$/,
  INTEGER_THREE: /^\d{1,3}$/,
  URL: /^([a-zA-Z]+:\/\/)?([a-zA-Z0-9\-.]+)([-\w ./?%&=:]*)$/,
  IDCARD: /^\d{6}(\d{4})(\d{2})(\d{2})\d{3}[0-9xX]$/i,
  CHINESE_NAME: /^[\u4e00-\u9fa5a-z/]{1,30}$/i,
  CHINESE: /[\u4e00-\u9fa5/]{1,30}/i,
  ENGLISH_NAME: /^[a-z][a-z ]+(\s*\/\s*[a-z ]+)?$/i,
  NUMBER_OR_CHAR: /^[a-z0-9A-Z]+$/
}

const validate = (text: string, regexp: RegExp, isTrim: boolean) => {
  if (isTrim) {
    text =
      text === null || typeof text === 'undefined' ? '' : (text + '').trim()
  }
  return regexp.test(text)
}

const _self = {
  REGEXP: REGEXP,
  isIdcard: (text: string, isTrim: boolean) =>
    validate(text, REGEXP.IDCARD, isTrim),

  isCellphone: (text: string, isTrim: boolean) =>
    validate(text, REGEXP.CELLPHONE, isTrim),

  isPhone: (text: string, isTrim: boolean) =>
    validate(text, REGEXP.PHONE, isTrim),

  isEmail: (text: string, isTrim: boolean) =>
    validate(text, REGEXP.EMAIL, isTrim),

  isNumber: (text: string, isTrim: boolean) =>
    validate(text, REGEXP.NUMBER, isTrim),

  isPassword: (text: string, isTrim: boolean) =>
    validate(text, REGEXP.PASSWORD, isTrim),

  isInteger: (text: string, isTrim: boolean) =>
    validate(text, REGEXP.INTEGER, isTrim),

  isIntegerThree: (text: string, isTrim: boolean) =>
    validate(text, REGEXP.INTEGER_THREE, isTrim),

  isEmpty: (text: string) =>
    text === null || typeof text === 'undefined' ? true : !(text + '').trim(),

  isUrl: (text: string, isTrim: boolean) => validate(text, REGEXP.URL, isTrim),

  isNumberOrChar: (text: string, isTrim: boolean) =>
    validate(text, REGEXP.NUMBER_OR_CHAR, isTrim),

  isChineseName: (text: string, isTrim: boolean) =>
    validate(text, REGEXP.CHINESE_NAME, isTrim),

  isChinese: (text: string, isTrim: boolean) =>
    validate(text, REGEXP.CHINESE, isTrim),

  isEnglishName: (text: string, isTrim: boolean) =>
    validate(text, REGEXP.ENGLISH_NAME, isTrim)
}

export default _self
