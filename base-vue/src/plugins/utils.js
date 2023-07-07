import validate from '@/utils/validate'
import * as $utils from '@/utils/utils'
import { $message } from './element'

export default app => {
  // 校验规则注入
  app.config.globalProperties.$validate = validate
  // 工具注入
  app.config.globalProperties.$utils = $utils
  // 提示
  app.config.globalProperties.$message = $message
}
