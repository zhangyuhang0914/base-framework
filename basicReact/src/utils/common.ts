/**
 * 获取css变量
 * @param name
 * @returns
 */
export const getCssVariable = (name: string) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
}
