import type { AppRouteModule } from '@/router/interface'
import mainRouter from './main'

/**
 * 统一导出所有路由模块
 * 这个文件可以被直接导入使用，也可以被router/index.ts中的动态导入逻辑自动加载
 */
const modulesRoutes: AppRouteModule[] = [
  ...mainRouter
]

/**
 * 动态获取目录下的所有路由文件，支持过滤不需要的文件
 * @param excludeFiles 要排除的文件名数组（不带.ts扩展名）
 * @returns 过滤后的路由模块数组
 */
export const getModules = (excludeFiles: string[] = []): AppRouteModule[] => {
  const routes: AppRouteModule[] = []
  // 动态导入模块路由
  const modules = import.meta.glob('./**/*.ts', { eager: true })
  Object.keys(modules).forEach(key => {
    // 获取文件名（不含路径和扩展名）
    const fileName = key.replace(/^\.\//, '').replace(/\.ts$/, '')
    // 过滤被排除的文件
    if (excludeFiles.includes(fileName)) return
    const mod = (modules as Record<string, any>)[key].default || {}
    const modList = Array.isArray(mod) ? [...mod] : [mod]
    routes.push(...modList)
  })
  return routes
}

/**
 * 动态获取非错误路由模块
 * @returns 非错误路由模块数组
 */
export const getMainModules = (): AppRouteModule[] => {
  return getModules(['index'])
}

export { mainRouter }
export default modulesRoutes
