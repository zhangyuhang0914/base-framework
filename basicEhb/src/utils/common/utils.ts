/**
 * 工具函数
 */
export class Utils {
  /**
   * 空函数
   */
  static noop(): void {}

  /**
   * 解析日期选择结果
   */
  static parseDateResult(result: any): string {
    // 根据实际日期格式进行调整
    if (result && result.year && result.month && result.day) {
      return `${result.year}-${result.month.toString().padStart(2, '0')}-${result.day.toString().padStart(2, '0')}`
    }
    return ''
  }
}
