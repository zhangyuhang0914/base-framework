/**
 * 字典数据管理
 */
import type { DictItem } from '@/api/interface/common'
import { useGlobalStoreHook } from '@/store/modules/global'

export const dictionaries = {
  // 政务服务
  governmentService: {
    // 热门检索
    HOT_SEARCH: 'RMJS'
  }
}

// 生成类型
type DeepKey<T> = T extends object
  ? {
      [K in keyof T]: K extends string ? (T[K] extends string ? K : `${K}.${DeepKey<T[K]>}`) : never
    }[keyof T]
  : never

export type DictionaryKeys = DeepKey<typeof dictionaries>

// 字典选项类型
export interface DictOption {
  label: string
  value: string
  code?: string
  disabled?: boolean
  ordernum?: number
  children?: DictOption[]
}

/**
 * 字典管理工具类
 */
class DictionaryManager {
  private globalStore: ReturnType<typeof useGlobalStoreHook>

  constructor() {
    this.globalStore = useGlobalStoreHook()
  }

  /**
   * 将 DictItem 转换为 DictOption
   */
  private convertToDictOption(item: DictItem): DictOption {
    return {
      label: item.remarks,
      value: item.dictionaryValues,
      code: item.dictcode,
      disabled: item.deleteFlag,
      ordernum: item.ordernum
    }
  }

  /**
   * 将 DictItem 数组转换为 DictOption 数组
   */
  private convertToDictOptions(data: DictItem[]): DictOption[] {
    return data
      .map(item => this.convertToDictOption(item))
      .sort((a, b) => (a.ordernum || 0) - (b.ordernum || 0))
  }

  /**
   * 获取字典标签
   * @param key 字典键名
   * @param value 字典值
   * @param defaultValue 默认值
   */
  async getDictLabel(
    key: DictionaryKeys,
    value: string | number,
    defaultValue: string = '--'
  ): Promise<string> {
    try {
      const options = await this.getDictOptions(key)
      const option = options.find(opt => opt.value === String(value))
      return option?.label || defaultValue
    } catch (error) {
      console.warn(`获取字典标签失败: ${key}`, error)
      return defaultValue
    }
  }

  /**
   * 获取字典选项列表
   * @param key 字典键名
   * @param withDisabled 是否包含禁用项
   */
  async getDictOptions(key: DictionaryKeys, withDisabled: boolean = false): Promise<DictOption[]> {
    try {
      const dictItems = await this.getDictItems(key)
      const filteredData = withDisabled ? dictItems : dictItems.filter(item => !item.deleteFlag)
      return this.convertToDictOptions(filteredData)
    } catch (error) {
      console.warn(`获取字典选项失败: ${key}`, error)
      return []
    }
  }

  /**
   * 获取树形字典选项（用于级联选择器等）
   * @param key 字典键名
   */
  async getDictTreeOptions(key: DictionaryKeys): Promise<DictOption[]> {
    try {
      const dictItems = await this.getDictItems(key)
      return this.buildTree(dictItems)
    } catch (error) {
      console.warn(`获取字典树失败: ${key}`, error)
      return []
    }
  }

  /**
   * 构建树形结构
   * @param data 字典数据
   */
  private buildTree(data: DictItem[]): DictOption[] {
    const itemMap = new Map<string, DictOption>()
    const tree: DictOption[] = []

    // 创建所有节点的映射
    data.forEach(item => {
      itemMap.set(item.id, {
        ...this.convertToDictOption(item),
        children: []
      })
    })

    // 构建树形结构
    data.forEach(item => {
      const node = itemMap.get(item.id)!
      if (item.pid === '0' || !item.pid || !itemMap.has(item.pid)) {
        tree.push(node)
      } else {
        const parent = itemMap.get(item.pid)
        if (parent) {
          if (!parent.children) {
            parent.children = []
          }
          parent.children.push(node)
        }
      }
    })

    // 排序
    const sortTree = (nodes: DictOption[]) => {
      nodes.sort((a, b) => (a.ordernum || 0) - (b.ordernum || 0))
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          sortTree(node.children)
        }
      })
    }

    sortTree(tree)
    return tree
  }

  /**
   * 获取字典原始数据
   * @param key 字典键名
   */
  private async getDictItems(key: DictionaryKeys): Promise<DictItem[]> {
    const dictKey = this.getDictKey(key)
    return await this.globalStore.getDict(dictKey)
  }

  /**
   * 获取字典数据（转换为 DictOption 格式）
   * @param key 字典键名
   */
  async getDictData(key: DictionaryKeys): Promise<DictOption[]> {
    try {
      const dictItems = await this.getDictItems(key)
      return this.convertToDictOptions(dictItems)
    } catch (error) {
      console.warn(`获取字典数据失败: ${key}`, error)
      return []
    }
  }

  /**
   * 获取过滤后的字典数据
   * @param key 字典键名
   */
  async getValidDictData(key: DictionaryKeys): Promise<DictOption[]> {
    try {
      const dictData = await this.getDictData(key)
      return dictData.filter(option => !option.disabled)
    } catch (error) {
      console.warn(`获取有效字典数据失败: ${key}`, error)
      return []
    }
  }

  /**
   * 根据字典值获取完整字典项
   * @param key 字典键名
   * @param value 字典值
   */
  async getDictItem(key: DictionaryKeys, value: string | number): Promise<DictOption | undefined> {
    try {
      const options = await this.getDictOptions(key)
      return options.find(option => option.value === String(value))
    } catch (error) {
      console.warn(`获取字典项失败: ${key}`, error)
      return undefined
    }
  }

  /**
   * 获取字典键名（从嵌套结构中提取最终的字典编码）
   * @param key 字典路径
   */
  private getDictKey(key: DictionaryKeys): string {
    const keys = key.split('.') as string[]
    let result: any = dictionaries

    for (const k of keys) {
      if (result[k] === undefined) {
        throw new Error(`字典键名不存在: ${key}`)
      }
      result = result[k]
    }

    return typeof result === 'string' ? result : ''
  }

  /**
   * 预加载多个字典
   * @param keys 字典键名数组
   */
  async preloadDicts(keys: DictionaryKeys[]): Promise<void> {
    const promises = keys.map(key => this.getDictItems(key))
    await Promise.all(promises)
  }

  /**
   * 清除字典缓存
   */
  clearDictCache(): void {
    this.globalStore.clearDict()
  }

  /**
   * 检查字典是否已加载
   * @param key 字典键名
   */
  isDictLoaded(key: DictionaryKeys): boolean {
    const dictKey = this.getDictKey(key)
    return !!this.globalStore.dictMap[dictKey]
  }

  /**
   * 批量获取字典标签
   * @param key 字典键名
   * @param values 字典值数组
   * @param separator 分隔符
   */
  async getDictLabels(
    key: DictionaryKeys,
    values: (string | number)[],
    separator: string = ','
  ): Promise<string> {
    try {
      const options = await this.getDictOptions(key)
      const labels = values.map(value => {
        const option = options.find(opt => opt.value === String(value))
        return option?.label || String(value)
      })
      return labels.join(separator)
    } catch (error) {
      console.warn(`批量获取字典标签失败: ${key}`, error)
      return values.join(separator)
    }
  }
}

// 创建单例实例
let dictManager: DictionaryManager | null = null

export const getDictManager = (): DictionaryManager => {
  if (!dictManager) {
    dictManager = new DictionaryManager()
  }
  return dictManager
}

// 方法导出
export const dictUtils = {
  // 获取字典标签
  getLabel: (key: DictionaryKeys, value: string | number, defaultValue?: string) =>
    getDictManager().getDictLabel(key, value, defaultValue),

  // 获取字典选项
  getOptions: (key: DictionaryKeys, withDisabled?: boolean) =>
    getDictManager().getDictOptions(key, withDisabled),

  // 获取树形选项
  getTreeOptions: (key: DictionaryKeys) => getDictManager().getDictTreeOptions(key),

  // 获取字典数据
  getData: (key: DictionaryKeys) => getDictManager().getDictData(key),

  // 获取有效字典数据
  getValidData: (key: DictionaryKeys) => getDictManager().getValidDictData(key),

  // 获取字典项
  getItem: (key: DictionaryKeys, value: string | number) =>
    getDictManager().getDictItem(key, value),

  // 预加载字典
  preload: (keys: DictionaryKeys[]) => getDictManager().preloadDicts(keys),

  // 清除缓存
  clear: () => getDictManager().clearDictCache(),

  // 检查是否已加载
  isLoaded: (key: DictionaryKeys) => getDictManager().isDictLoaded(key),

  // 批量获取字典标签
  getLabels: (key: DictionaryKeys, values: (string | number)[], separator?: string) =>
    getDictManager().getDictLabels(key, values, separator)
}

export default getDictManager
