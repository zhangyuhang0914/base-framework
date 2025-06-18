import React, { useState } from 'react'
import reactLogo from '@assets/react.svg'
import viteLogo from '/vite.svg'
import { Button, ColorPicker, Input, theme } from 'antd'

const Dispatch: React.FC = () => {
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
      <a href="https://vite.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
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
      </div>
    </>
  )
}

export default Dispatch
