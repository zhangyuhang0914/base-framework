# Notification 通知组件

基于 Ant Design 的 notification 组件进行二次封装，提供更便捷的 API 和统一的配置管理。

## 特性

- 🎯 **简化 API**：提供更简洁的调用方式
- 🔧 **全局配置**：支持全局默认配置
- 🎨 **类型安全**：完整的 TypeScript 类型支持
- 🪝 **Hook 支持**：提供 Hook 和静态方法两种使用方式
- 📦 **轻量封装**：保持原有功能的同时简化使用

## 安装使用

```tsx
import { Notification, useNotification } from '@/components/antd'
```

## API

### NotificationOptions

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| message | 通知标题 | `string` | - |
| description | 通知描述 | `string` | - |
| placement | 显示位置 | `NotificationPlacement` | `topRight` |
| duration | 自动关闭延时（秒） | `number` | `4.5` |
| onClick | 点击通知时的回调 | `() => void` | - |
| onClose | 关闭时的回调 | `() => void` | - |
| icon | 自定义图标 | `React.ReactNode` | - |
| className | 自定义样式类名 | `string` | - |
| style | 自定义样式 | `React.CSSProperties` | - |

### 静态方法

> **⚠️ 警告**：静态方法在 React 18 并发模式下可能会触发 "calling notice in render" 警告。建议使用 useNotification Hook 代替。

#### Notification.config(config)

设置全局默认配置。

```tsx
Notification.config({
  placement: 'topRight',
  duration: 3
})
```

#### Notification.success(options) [已废弃]

显示成功通知。

```tsx
// ⚠️ 不推荐在 React 18 并发模式下使用
Notification.success({
  message: '操作成功',
  description: '您的操作已成功完成！'
})

// ✅ 推荐使用 Hook 方式
const [notification] = useNotification()
notification.success({
  message: '操作成功',
  description: '您的操作已成功完成！'
})
```

#### Notification.error(options) [已废弃]

显示错误通知。

```tsx
// ⚠️ 不推荐在 React 18 并发模式下使用
Notification.error({
  message: '操作失败',
  description: '请检查网络连接后重试',
  duration: 0 // 不自动关闭
})
```

#### Notification.warning(options) [已废弃]

显示警告通知。

```tsx
// ⚠️ 不推荐在 React 18 并发模式下使用
Notification.warning({
  message: '警告提示',
  description: '请注意数据安全'
})
```

#### Notification.info(options) [已废弃]

显示信息通知。

```tsx
// ⚠️ 不推荐在 React 18 并发模式下使用
Notification.info({
  message: '信息提示',
  description: '这是一条普通信息'
})
```

#### Notification.open(options) [已废弃]

显示自定义通知。

```tsx
// ⚠️ 不推荐在 React 18 并发模式下使用
Notification.open({
  type: 'success',
  message: '自定义通知',
  description: '这是一个自定义通知',
  icon: <span>🎉</span>
})
```

#### Notification.destroy(key?)

关闭通知。如果提供 key 参数，则关闭指定的通知；否则关闭所有通知。

```tsx
// 关闭所有通知
Notification.destroy()

// 关闭指定 key 的通知
Notification.destroy('notification-key')
```

### Hook 使用

#### useNotification()

返回通知 API 和 contextHolder。

```tsx
const NotificationDemo = () => {
  const [notification, contextHolder] = useNotification()

  const handleClick = () => {
    notification.success({
      message: '成功',
      description: '操作成功完成'
    })
  }

  const handleDestroy = () => {
    // 关闭所有通知
    notification.destroy()
    
    // 或关闭指定通知
    // notification.destroy('notification-key')
  }

  return (
    <>
      {contextHolder}
      <Button onClick={handleClick}>显示通知</Button>
      <Button onClick={handleDestroy}>关闭通知</Button>
    </>
  )
}
```

## 使用示例

### 基础用法

```tsx
import React from 'react'
import { Button } from 'antd'
import { Notification } from '@/components/antd'

const Demo = () => {
  const handleSuccess = () => {
    Notification.success({
      message: '保存成功',
      description: '数据已成功保存到服务器'
    })
  }

  return <Button onClick={handleSuccess}>保存</Button>
}
```

### Hook 用法

```tsx
import React from 'react'
import { Button } from 'antd'
import { useNotification } from '@/components/antd'

const Demo = () => {
  const [notification, contextHolder] = useNotification()

  const handleError = () => {
    notification.error({
      message: '网络错误',
      description: '请检查网络连接后重试'
    })
  }

  return (
    <>
      {contextHolder}
      <Button onClick={handleError}>测试错误</Button>
    </>
  )
}
```

### 全局配置

```tsx
import { Notification } from '@/components/antd'

// 在应用启动时配置
Notification.config({
  placement: 'topRight',
  duration: 3
})
```

## 配置说明

### React 18 并发模式兼容性

**重要提示**：静态方法（如 `Notification.success`）在 React 18 并发模式下可能会出现 "calling notice in render" 警告。

**推荐做法**：
1. **优先使用 useNotification Hook**：在组件内部使用 Hook 方式调用 notification
2. **避免在渲染中调用静态方法**：静态方法应该只在事件处理器、useEffect 等非渲染阶段调用
3. **正确配置 contextHolder**：在 App.tsx 中使用 useNotification Hook 并将 contextHolder 放置在 ConfigProvider 内部

为了让静态方法能够获取 `ConfigProvider` 的 `context` 并避免 React 18 并发模式警告，需要在应用根级别正确配置：

```tsx
// App.tsx
import { ConfigProvider } from 'antd'
import { useNotification } from '@/components/antd'

function App() {
  const [notification, contextHolder] = useNotification()
  
  return (
    <ConfigProvider theme={{ token: { borderRadius: 8 } }}>
      {contextHolder}
      <YourAppContent />
    </ConfigProvider>
  )
}
```

**重要配置要求**：
1. 必须在 App.tsx 中使用 `useNotification` Hook
2. `contextHolder` 必须放置在 `ConfigProvider` 内部
3. 这样配置可以避免 React 18 "calling notice in render" 警告
4. 同时确保所有 notification 都能获取到主题配置

## 注意事项

1. **Hook vs 静态方法**：
   - 静态方法：简单快捷，适合全局使用
   - Hook 方法：需要 contextHolder，适合组件内使用

2. **React 18 并发模式兼容**：
   - 必须在 App.tsx 中使用 `useNotification` Hook 并放置 `contextHolder`
   - `contextHolder` 必须放在 `ConfigProvider` 内部
   - Hook 内部使用 `useCallback` 和 `useMemo` 优化，避免重复创建
   - 这样可以避免 "calling notice in render" 警告
   - 在自定义 Hook 中使用时，必须在 `useCallback` 依赖数组中包含 `notification` 对象

3. **全局配置**：
   - 建议在应用启动时进行全局配置
   - 单次调用的配置会覆盖全局配置

4. **性能考虑**：
   - Hook 方式会在组件内创建通知实例
   - 静态方法使用全局实例，性能更好

5. **类型安全**：
   - 所有选项都有完整的 TypeScript 类型支持
   - 建议使用 TypeScript 获得更好的开发体验