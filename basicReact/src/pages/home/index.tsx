import React, { useState, useEffect } from 'react'
import { Button, Card, Typography, Space, Divider } from 'antd'
import { $t, changeLanguage } from '@/language'
import styled from 'styled-components'
import ThemePicker from '@/pages/layout/components/appearance/themePicker'
import { Icon } from '@iconify/react/dist/iconify.js'
import { preferencesManager } from '@/config/preferencesManager'
import NotificationExample from '@/components/antd/notification/example'

const { Title, Paragraph, Text } = Typography

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`
const ColorBlock = styled.div<{ color: string }>`
  width: 100px;
  height: 60px;
  background-color: ${props => props.color};
  border-radius: 4px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => (props.color === '#ffffff' ? '#000' : '#fff')};
`
const FlexRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`

const Home: React.FC = () => {
  const [count, setCount] = useState(0)
  const [currentThemeColor, setCurrentThemeColor] = useState(
    preferencesManager.getTheme().colorPrimary
  )

  useEffect(() => {
    // 监听配置变化
    const unsubscribe = preferencesManager.addListener(preferences => {
      setCurrentThemeColor(preferences.theme.colorPrimary)
    })
    return unsubscribe
  }, [])

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <StyledCard>
        <Title level={2}>主题设置</Title>
        <Paragraph>
          您可以通过以下颜色选择器来更改系统的主题色。选择的主题色将被保存到Redux和浏览器缓存中。
        </Paragraph>
        <NotificationExample></NotificationExample>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <FlexRow>
            <ThemePicker />
          </FlexRow>
          <Divider orientation="left">当前主题信息</Divider>
          <FlexRow>
            <Icon icon="mdi:home" width="24" height="24" />
            <Icon icon="fa-solid:user" color="#ff0000" />
            <Icon icon="ph:arrow-elbow-left-up-duotone" fontSize={36} />
            <ColorBlock color={currentThemeColor}>主题色</ColorBlock>
            <div>
              <Text strong>当前主题色值：</Text>
              <Text code>{currentThemeColor}</Text>
            </div>
          </FlexRow>
          <Divider orientation="left">主题色应用示例</Divider>
          <Space direction="vertical" size="middle">
            <Button type="primary" size="large">
              主题色按钮
            </Button>
            <Card title="主题色卡片示例" style={{ width: 300 }} hoverable>
              <p>这是一个使用主题色的卡片示例</p>
              <Button type="primary">确认</Button>
            </Card>
            <div className="card">
              <button
                style={{
                  background: currentThemeColor,
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setCount(count => count + 1)}
              >
                计数器: {count}
              </button>
            </div>
            <div>
              <p>{$t('welcome')}</p>
              <Space>
                <button onClick={() => changeLanguage('zh')}>切换中文</button>
                <button onClick={() => changeLanguage('en')}>切换英文</button>
              </Space>
            </div>
          </Space>
        </Space>
      </StyledCard>
    </div>
  )
}

export default Home
