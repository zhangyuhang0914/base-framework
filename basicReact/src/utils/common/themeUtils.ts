/**
 * 主题工具类
 */
export class ThemeUtils {
  /**
   * 设置CSS变量
   * @param name CSS变量名
   * @param value CSS变量值
   */
  static setCssVariable(name: string, value: string): void {
    document.documentElement.style.setProperty(name, value)
  }

  /**
   * 更新主题色
   * @param primaryColor 主题色
   */
  static updateThemeColor(primaryColor: string): void {
    this.setCssVariable('--color-primary', primaryColor)
  }

  /**
   * 获取颜色的亮度
   * @param color 颜色值 (十六进制格式: #RRGGBB)
   * @returns 亮度值 (0-255)
   */
  static getColorBrightness(color: string): number {
    // 移除#前缀并转换为RGB
    const hex = color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    
    // 计算亮度 (人眼对绿色最敏感，对蓝色最不敏感)
    return (r * 0.299 + g * 0.587 + b * 0.114)
  }

  /**
   * 判断是否应该使用深色文本
   * @param backgroundColor 背景色
   * @returns 如果背景色较亮返回true，应使用深色文本
   */
  static shouldUseDarkText(backgroundColor: string): boolean {
    const brightness = this.getColorBrightness(backgroundColor)
    return brightness > 128 // 亮度阈值
  }
}