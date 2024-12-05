'use strict'

import { useToggle } from '@vant/use'

// 邮箱校验器
export const validateEmail = (value: string) => {
  const [state, toggle] = useToggle()
  if (value === '') {
    toggle(true)
    return state.value
  } else {
    if (/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,6}$/.test(value)) {
      toggle(true)
      return state.value
    } else {
      toggle(false)
      return '请输入正确的邮箱地址'
    }
  }
}

// 联系电话校验器（包含手机号、座机号、短号等）
export const validateTelephone = (value: string) => {
  const [state, toggle] = useToggle()
  if (value === '' || value === null || typeof value === 'undefined') {
    toggle(true)
    return state.value
  } else {
    toggle(true)
    if (/^([+]?[\d]{1,3}-|[ ])?((13[0-9]{9})|(18[0-9]{9})|(19[0-9]{9})|(15[0-9]{9})|(16[0-9]{9})|(14[0-9]{9})|(17[0-9]{9}))$/.test(value)) {
      // 验证手机
      return state.value
    } else if (/^(([0\+]\d{2,3}-?)?(0\d{2,3})-?)?(\d{7,8})(-(\d{3,}))?$/.test(value)) {
      // 验证座机
      return state.value
    } else {
      toggle(false)
      return '请输入正确的联系号码'
    }
  }
}

// 手机号码校验器
export const validateMobile = (value: string) => {
  const [state, toggle] = useToggle()
  if (value === '') {
    toggle(true)
    return state.value
  } else {
    if (/^([+]?[\d]{1,3}-|[ ])?((13[0-9]{9})|(18[0-9]{9})|(15[0-9]{9})|(16[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(19[0-9]{9}))$/.test(value)) {
      toggle(true)
      return state.value
    } else {
      toggle(false)
      return '请输入正确的手机号码'
    }
  }
}

// 非null校验
export const validateNotNull = (value: string) => {
  const [state, toggle] = useToggle()
  if (value === 'null' || value === null) {
    toggle(false)
    return '不能填写null'
  } else {
    toggle(true)
    return state.value
  }
}

// 座机号码校验器
export const validateTel = (value: string) => {
  const [state, toggle] = useToggle()
  if (!value) return '号码不能为空'
  if (/^(([0\+]\d{2,3}-?)?(0\d{2,3})-?)?(\d{7,8})(-(\d{3,}))?$/.test(value)) {
    toggle(true)
    return state.value
  } else {
    toggle(false)
    return '请输入正确的号码'
  }
}

// 只能输入英文字母、数字、下划线
export const validateEnNumUdl = (value: string) => {
  const [state, toggle] = useToggle()
  if (value === '') {
    toggle(true)
    return state.value
  } else {
    if (/^[A-Za-z0-9_]+$/.test(value)) {
      toggle(true)
      return state.value
    } else {
      toggle(false)
      return '只能输入英文字母、数字、下划线'
    }
  }
}
// 不能输入空格
export const validateBlack = (value: string) => {
  const [state, toggle] = useToggle()
  if (value === '' || value.trim() === '') {
    toggle(false)
    return '输入不能为空'
  } else {
    toggle(true)
    return state.value
  }
}

// 只能输入0%-100%的百分比
export const validatePercent = (value: string) => {
  const [state, toggle] = useToggle()
  if (value === '') {
    toggle(true)
    return state.value
  } else {
    if (/^(?:[1-9]?\d|100)$/.test(value)) {
      toggle(true)
      return state.value
    } else {
      toggle(false)
      return '只能输入0%-100%的百分比'
    }
  }
}

// 只能输入日期,格式为yyyy-MM-dd或yyyy-M-d
export const validateDate = (value: string) => {
  const [state, toggle] = useToggle()
  if (value === '') {
    toggle(true)
    return state.value
  } else {
    if (
      /^(?:(?!0000)[0-9]{4}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))$/.test(
        value
      )
    ) {
      toggle(true)
      return state.value
    } else {
      toggle(false)
      return '只能输入日期,格式为yyyy-MM-dd或yyyy-M-d'
    }
  }
}

/*
 * 身份证号码验证，验证规则如下
 * 总共十八位
 * 第一位不可能是0
 * 第二位到第六位可以是0-9
 * 第七位到第十位是年份，所以七八位为19或者20
 * 十一位和十二位是月份，这两位是01-12之间的数值
 * 十三位和十四位是日期，是从01-31之间的数值
 * 十五，十六，十七都是数字0-9
 * 十八位可能是数字0-9，也可能是X
 * */
export const checkIdCard = (value: string) => {
  const [state, toggle] = useToggle()
  const reg = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/
  if (value === '') {
    toggle(true)
    return state.value
  } else {
    if (reg.test(value)) {
      toggle(true)
      return state.value
    } else {
      toggle(false)
      return '请输入正确的身份证号码'
    }
  }
}

/**
 * @desc: 用户名
 * @return {*}
 * @author: ZYH
 */
export const validateUsername = (value: string) => {
  const [state, toggle] = useToggle()
  const reg = /^[A-Za-z0-9_]{6,20}$/
  if (value === '') {
    toggle(true)
    return state.value
  } else {
    if (reg.test(value)) {
      toggle(true)
      return state.value
    } else {
      toggle(false)
      return '用户名长度6~20个字符，由字母、数字0~9和下划线组成'
    }
  }
}

/**
 * @desc: 密码
 * @return {*}
 * @author: ZYH
 */
export const validatePassword = (value: string) => {
  const [state, toggle] = useToggle()
  // var reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8}[A-Za-z\d$@$!%*?&.:'",]*$/
  const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d$@$!%*?&.:'",]{8,18}$/
  if (value === '') {
    toggle(true)
    return state.value
  } else {
    if (reg.test(value)) {
      toggle(true)
      return state.value
    } else {
      toggle(false)
      return '包含8-18位大小写字母和数字的密码'
    }
  }
}
