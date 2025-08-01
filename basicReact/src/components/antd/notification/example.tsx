import React from 'react'
import { Button, Space } from 'antd'
import Notification, { useNotification } from './index'

/**
 * 静态方法使用示例
 */
const StaticExample: React.FC = () => {
  const handleSuccess = () => {
    Notification.success({
      message: '操作成功',
      description: '您的操作已成功完成！'
    })
  }

  const handleError = () => {
    Notification.error({
      message: '操作失败',
      description: '请检查网络连接后重试',
      duration: 0 // 不自动关闭
    })
  }

  const handleWarning = () => {
    Notification.warning({
      message: '警告提示',
      description: '请注意数据安全',
      placement: 'topLeft'
    })
  }

  const handleInfo = () => {
    Notification.info({
      message: '信息提示',
      description: '这是一条普通信息',
      onClick: () => console.log('点击了通知')
    })
  }

  return (
    <Space>
      <Button type="primary" onClick={handleSuccess}>
        成功通知
      </Button>
      <Button danger onClick={handleError}>
        错误通知
      </Button>
      <Button onClick={handleWarning}>
        警告通知
      </Button>
      <Button onClick={handleInfo}>
        信息通知
      </Button>
    </Space>
  )
}

/**
 * Hook 使用示例
 */
const HookExample: React.FC = () => {
  const [notification, contextHolder] = useNotification()

  const handleSuccess = () => {
    notification.success({
      message: 'Hook 成功',
      description: '使用 Hook 方式的成功通知'
    })
  }

  const handleCustom = () => {
    notification.open({
      type: 'info',
      message: '自定义通知',
      description: '这是一个自定义类型的通知',
      icon: <span>🎉</span>
    })
  }

  return (
    <>
      {contextHolder}
      <Space>
        <Button type="primary" onClick={handleSuccess}>
          Hook 成功通知
        </Button>
        <Button onClick={handleCustom}>
          自定义通知
        </Button>
      </Space>
    </>
  )
}

/**
 * 完整示例组件
 */
const NotificationExample: React.FC = () => {
  // 设置全局配置
  React.useEffect(() => {
    Notification.config({
      placement: 'topRight',
      duration: 3
    })
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h3>静态方法使用</h3>
      <StaticExample />
      
      <h3 style={{ marginTop: '20px' }}>Hook 使用</h3>
      <HookExample />
      
      <div style={{ marginTop: '20px' }}>
        <Space>
          <Button 
            onClick={() => Notification.destroy()}
            type="dashed"
          >
            清除所有通知
          </Button>
          <Button 
            onClick={() => Notification.destroy('test-key')}
            type="dashed"
          >
            清除指定通知
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default NotificationExample