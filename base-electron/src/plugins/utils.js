import validate from '@/utils/validate'
import * as $utils from '@/utils/utils'

export default app => {
  // 校验规则注入
  app.config.globalProperties.$validate = validate
  // 工具注入
  app.config.globalProperties.$utils = $utils
}
