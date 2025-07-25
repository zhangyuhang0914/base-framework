import React, { useState } from 'react'
import reactLogo from '@assets/react.svg'
import { Button, Card, Input, Typography, Space, Divider } from 'antd'
import { $t, changeLanguage } from '@/language'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux'
import styled from 'styled-components'
import ThemePicker from '@/components/themePicker'

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
  const { settingConf } = useSelector((state: RootState) => state.global)
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <StyledCard>
        <Title level={2}>主题设置</Title>
        <Paragraph>
          您可以通过以下颜色选择器来更改系统的主题色。选择的主题色将被保存到Redux和浏览器缓存中。
        </Paragraph>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <FlexRow>
            <ThemePicker label="选择主题色" />
          </FlexRow>

          <Divider orientation="left">当前主题信息</Divider>

          <FlexRow>
            <ColorBlock color={settingConf.theme.primaryColor}>
              主题色
            </ColorBlock>
            <div>
              <Text strong>当前主题色值：</Text>
              <Text code>{settingConf.theme.primaryColor}</Text>
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
                  background: settingConf.theme.primaryColor,
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
