import React, { useState } from 'react'
import reactLogo from '@assets/react.svg'
import { Button, ColorPicker, Input, theme } from 'antd'
import reactEasyI18n, { $t, changeLanguage } from '@/language'

const Home: React.FC = () => {
  const [primary, setPrimary] = React.useState('#1677ff')
  const { useToken } = theme
  const { token } = useToken()
  const [count, setCount] = useState(0)

  return (
    <>
      <ColorPicker
        showText
        value={primary}
        onChange={color => setPrimary(color.toHexString())}
      />
      <Button type="primary">点击我</Button>
      <Input placeholder="输入框" />
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          style={{ background: token.colorError }}
          onClick={() => setCount(count => count + 1)}
        >
          count is {count}
        </button>
        <Button type="primary">Primary Button</Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <p>这是美妙的一天</p>
        <Button type="primary">我是首页</Button>
        <p>{$t('welcome')}</p>
        <p>{$t('notData')}</p>
        <Button type="primary">{$t('notData')}</Button>
        <button onClick={() => changeLanguage('zh')}>切换中文</button>
        <button onClick={() => changeLanguage('en')}>切换英文</button>
      </div>
    </>
  )
}

export default Home
