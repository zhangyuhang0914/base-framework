'use strict'

const REGEXP = {
  CELLPHONE: /^0?(1[3-9][0-9]|0?85[23])[0-9]{8}$/, // 手机号码
  PHONE: /^([0-9]{3,4}(-\|)?)?[0-9]{7,8}$/, // 电话号
  EMAIL:
    /^[a-z0-9A-Z]+([._\\-]*[a-z0-9A-Z])*@([a-z0-9A-Z]+[-a-z0-9A-Z]*[a-z0-9A-Z]+.){1,63}[a-z0-9A-Z]+$/,
  NUMBER: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,
  PASSWORD:
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}[\]:";'<>?,./]).{6,16}$/,
  INTEGER: /^\d+$/,
  INTEGER_THREE: /^\d{1,3}$/,
  URL: /^([a-zA-Z]+:\/\/)?([a-zA-Z0-9\-.]+)([-\w ./?%&=:]*)$/,
  IDCARD: /^\d{6}(\d{4})(\d{2})(\d{2})\d{3}[0-9xX]$/i,
  CHINESE_NAME: /^[\u4e00-\u9fa5a-z/]{1,30}$/i,
  CHINESE: /[\u4e00-\u9fa5/]{1,30}/i,
  ENGLISH_NAME: /^[a-z][a-z ]+(\s*\/\s*[a-z ]+)?$/i,
  NUMBER_OR_CHAR: /^[a-z0-9A-Z]+$/
}

const validate = (text, regexp, isTrim) => {
  if (isTrim) {
    text =
      text === null || typeof text === 'undefined' ? '' : (text + '').trim()
  }
  return regexp.test(text)
}

const _self = {
  REGEXP: REGEXP,

  isIdcard: (text, isTrim) => validate(text, REGEXP.IDCARD, isTrim),

  isCellphone: (text, isTrim) => validate(text, REGEXP.CELLPHONE, isTrim),

  isPhone: (text, isTrim) => validate(text, REGEXP.PHONE, isTrim),

  isEmail: (text, isTrim) => validate(text, REGEXP.EMAIL, isTrim),

  isNumber: (text, isTrim) => validate(text, REGEXP.NUMBER, isTrim),

  isPassword: (text, isTrim) => {
    console.log(
      '1111',
      validate(text, REGEXP.PASSWORD, isTrim),
      text,
      REGEXP.PASSWORD
    )
    validate(text, REGEXP.PASSWORD, isTrim)
  },

  isInteger: (text, isTrim) => validate(text, REGEXP.INTEGER, isTrim),

  isIntegerThree: (text, isTrim) =>
    validate(text, REGEXP.INTEGER_THREE, isTrim),

  isEmpty: text =>
    text === null || typeof text === 'undefined' ? true : !(text + '').trim(),

  isUrl: (text, isTrim) => validate(text, REGEXP.URL, isTrim),

  isNumberOrChar: (text, isTrim) =>
    validate(text, REGEXP.NUMBER_OR_CHAR, isTrim),

  isChineseName: (text, isTrim) => validate(text, REGEXP.CHINESE_NAME, isTrim),

  isChinese: (text, isTrim) => validate(text, REGEXP.CHINESE, isTrim),

  isEnglishName: (text, isTrim) => validate(text, REGEXP.ENGLISH_NAME, isTrim)
}

export default _self
