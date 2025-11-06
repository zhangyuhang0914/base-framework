export class ErrorHandler {
  /**
   * 抛出参数错误
   */
  static throwInvalidParam(paramName: string, expectedType: string): never {
    throw new Error(`参数 "${paramName}" 必须是 ${expectedType}`)
  }

  /**
   * 记录错误日志
   */
  static logError(methodName: string, error: any): void {
    console.error(`[${methodName}] 方法执行错误:`, error)
  }
}
