/**
 * CSS单位转换工具
 */
export class UnitConverter {
  // 获取根元素字体大小
  private static getRootFontSize() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize)
  }

  // rem转px
  static remToPx(remValue: string | number) {
    const value = parseFloat(String(remValue))
    const rootFontSize = this.getRootFontSize()
    return value * rootFontSize
  }

  // px转rem
  static pxToRem(pxValue: string | number) {
    const value = parseFloat(String(pxValue))
    const rootFontSize = this.getRootFontSize()
    return value / rootFontSize
  }

  // 获取CSS变量名称的值
  static getCssVariable = (name: string) => {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  }

  // 获取CSS变量并自动转换为px
  static getCssVariablePx(name: string) {
    const value = this.getCssVariable(name)
    if (value.endsWith('rem')) {
      return this.remToPx(value)
    }
    if (value.endsWith('px')) {
      return parseFloat(value)
    }
    return 0 // 处理未知单位
  }
}
