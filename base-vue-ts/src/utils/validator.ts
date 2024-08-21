'use strict'
// 邮箱校验器
export const validateEmail = (rule: AnyObject, value: string, callback: (error?: Error) => void) => {
  if (value === '') {
    callback()
  } else {
    if (/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,6}$/.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的邮箱地址'))
    }
  }
}

// 联系电话校验器（包含手机号、座机号、短号等）
export const validateTelephone = (rule: AnyObject, value: string, callback: (error?: Error) => void) => {
  if (value === '' || value === null || typeof value === 'undefined') {
    callback()
  } else {
    if (/^([+]?[\d]{1,3}-|[ ])?((13[0-9]{9})|(18[0-9]{9})|(19[0-9]{9})|(15[0-9]{9})|(16[0-9]{9})|(14[0-9]{9})|(17[0-9]{9}))$/.test(value)) {
      // 验证手机
      callback()
    } else if (/^(([0\+]\d{2,3}-?)?(0\d{2,3})-?)?(\d{7,8})(-(\d{3,}))?$/.test(value)) {
      // 验证座机
      callback()
    } else if (value.length == 5 && /^\d{5}$/g.exec(value)) {
      // 验证5位数字号码
      callback()
    } else if (value.length == 3 && /^\d{3}$/g.exec(value)) {
      // 验证3位数字号码
      callback()
    } else if (value.length == 10 && /^\d{10}$/g.exec(value)) {
      // 验证10位数字号码
      callback()
    } else {
      callback(new Error('请输入正确的联系号码'))
    }
  }
}

// 手机号码校验器
export const validateMobile = (rule: AnyObject, value: string, callback: (error?: Error) => void) => {
  if (value === '') {
    callback()
  } else {
    if (/^([+]?[\d]{1,3}-|[ ])?((13[0-9]{9})|(18[0-9]{9})|(15[0-9]{9})|(16[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(19[0-9]{9}))$/.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的手机号码'))
    }
  }
}

// 非null校验
export const validateNotNull = (rule: AnyObject, value: string, callback: (error?: Error) => void) => {
  if (value === 'null' || value === null) {
    callback(new Error('不能填写null'))
  } else {
    callback()
  }
}

// 座机号码校验器
export const validateTel = (rule: AnyObject, value: string, callback: (error?: Error) => void) => {
  if (value) {
    if (/^(([0\+]\d{2,3}-?)?(0\d{2,3})-?)?(\d{7,8})(-(\d{3,}))?$/.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的号码'))
    }
  } else {
    if (rule && rule.require) {
      callback(new Error('号码不能为空'))
    } else {
      callback()
    }
  }
}

// 只能输入英文字母、数字、下划线
export const validateEnNumUdl = (rule: AnyObject, value: string, callback: (error?: Error) => void) => {
  if (value === '') {
    callback()
  } else {
    if (/^[A-Za-z0-9_]+$/.test(value)) {
      callback()
    } else {
      callback(new Error('只能输入英文字母、数字、下划线'))
    }
  }
}
// 不能输入空格
export const validateBlack = (rule: AnyObject, value: string, callback: (error?: Error) => void) => {
  if (value === '' || value.trim() === '') {
    callback(new Error('输入不能为空'))
  } else {
    callback()
  }
}
// 只能输入数字，且可通过 max 和 min 限制大小, 通过 int:true 限制必须为整数
export const validateNumber = (rule: AnyObject, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback()
  } else {
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      const val = parseFloat(value)
      const result = {
        min: {
          result: false,
          msg: '最小输入 ' + rule.min
        },
        max: {
          result: false,
          msg: '最大输入 ' + rule.max
        },
        int: {
          result: false,
          msg: '请输入整数'
        }
      }
      if (rule.min !== undefined) {
        val >= rule.min ? (result.min.result = true) : callback(new Error(result.min.msg))
      }
      if (rule.max !== undefined) {
        val <= rule.max ? (result.max.result = true) : callback(new Error(result.max.msg))
      }
      if (rule.int) {
        ;/^(0|[1-9][0-9]*|-[1-9][0-9]*)$/.test(value) ? (result.int.result = true) : callback(new Error(result.int.msg))
      }
      result.min && result.max && result.int && callback()
    } else {
      callback(new Error('请输入数字'))
    }
  }
}

// 只能输入数字，且可通过 max 限制输入长度, 通过 decimalRegex:2 限制小数位数
export const validateDoubleNumber = (rule: AnyObject, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback()
  } else {
    const [integerPart, decimalPart] = value.split('.')
    const integerRegex = new RegExp(`^\\d{1,${rule.max}}$`)
    if (rule.max && !integerRegex.test(integerPart)) {
      callback(new Error(`最大填写${rule.max}位数字`))
      return
    }
    const decimalRegex = new RegExp(`^\\d{1,${rule.decimalPrecision}}$`)
    if (rule.decimalPrecision && decimalPart && !decimalRegex.test(decimalPart)) {
      callback(new Error('最多保留两位小数'))
      return
    }
  }
}

// 只能输入数字，且可通过 max 和 min 限制大小, 通过 int:true 限制必须为正整数
export const validatePositiveNumber = (rule: AnyObject, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback()
  } else {
    console.log(value)
    if (/^\d+(\.\d+)?$/.test(value)) {
      const val = parseFloat(value)
      if (val <= 0) {
        callback(new Error('请输入正整数'))
      }
      const result = {
        min: {
          result: false,
          msg: '最小输入 ' + rule.min
        },
        max: {
          result: false,
          msg: '最大输入 ' + rule.max
        },
        int: {
          result: false,
          msg: '请输入数字'
        }
      }
      if (rule.min !== undefined) {
        val >= rule.min ? (result.min.result = true) : callback(new Error(result.min.msg))
      }
      if (rule.max !== undefined) {
        val <= rule.max ? (result.max.result = true) : callback(new Error(result.max.msg))
      }
      if (rule.int) {
        ;/^\d+$/.test(value) ? (result.int.result = true) : callback(new Error(result.int.msg))
      }
      result.min && result.max && result.int && callback()
    } else {
      callback(new Error('请输入数字'))
    }
  }
}

// 只能输入double数字，且可通过 max 和 min 限制大小
export const validatePositiveDoubleNumber = (rule: AnyObject, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback()
  } else {
    // if (/^[-\+]?\d+(\.\d+)?$/.test(value)) {
    if (/^(0|[0-9]\.[0-9]+|([1-9][0-9]*(\.?[0-9]+))|[1-9])$/.test(value)) {
      const val = parseFloat(value)
      if (val < 0) {
        callback(new Error('请输入正整数'))
      }
      const result = {
        min: {
          result: false,
          msg: '最小输入 ' + rule.min
        },
        max: {
          result: false,
          msg: '最大输入 ' + rule.max
        }
      }
      if (rule.min !== undefined) {
        val >= rule.min ? (result.min.result = true) : callback(new Error(result.min.msg))
      }
      if (rule.max !== undefined) {
        val <= rule.max ? (result.max.result = true) : callback(new Error(result.max.msg))
      }
      result.min && result.max && callback()
    } else {
      callback(new Error('请输入数字'))
    }
  }
}

// 只能输入0%-100%的百分比
export const validatePercent = (rule: AnyObject, value: string, callback: (error?: Error) => void) => {
  if (value === '') {
    callback()
  } else {
    if (/^(?:[1-9]?\d|100)$/.test(value)) {
      callback()
    } else {
      callback(new Error('只能输入0%-100%的百分比'))
    }
  }
}

// 只能输入日期,格式为yyyy-MM-dd或yyyy-M-d
export const validateDate = (rule: AnyObject, value: string, callback: (error?: Error) => void) => {
  if (value === '') {
    callback()
  } else {
    if (
      /^(?:(?!0000)[0-9]{4}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))$/.test(
        value
      )
    ) {
      callback()
    } else {
      callback(new Error('只能输入日期,格式为yyyy-MM-dd或yyyy-M-d'))
    }
  }
}

export const checkPostal = (rule: AnyObject, value: string, callback: (error?: Error) => void) => {
  const reg = /^[0-9]{6}$/
  if (reg.test(value)) {
    callback()
  } else if (value === '' || value.length === 0) {
    if (rule && rule.require) {
      callback(new Error('请输入您的邮政编码'))
    }
    callback()
  } else {
    callback(new Error('请输入正确格式的邮政编码'))
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
export const checkIdCard = (rule: AnyObject, value: string, callback: (error?: Error) => void) => {
  const reg = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/
  if (value === '') {
    callback()
  } else {
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的身份证号码'))
    }
  }
}

/**
 * @desc: 用户名
 * @return {*}
 * @author: ZYH
 */
export const validateUsername = (rule: AnyObject, value: string, callback: (error?: Error) => void) => {
  const reg = /^[A-Za-z0-9_]{6,20}$/
  if (value === '') {
    callback()
  } else {
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('用户名长度6~20个字符，由字母、数字0~9和下划线组成'))
    }
  }
}

/**
 * @desc: 密码
 * @return {*}
 * @author: ZYH
 */
export const validatePassword = (rule: AnyObject, value: string, callback: (error?: Error) => void) => {
  // var reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8}[A-Za-z\d$@$!%*?&.:'",]*$/
  const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d$@$!%*?&.:'",]{8,18}$/
  if (value === '') {
    callback()
  } else {
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('包含8-18位大小写字母和数字的密码'))
    }
  }
}
