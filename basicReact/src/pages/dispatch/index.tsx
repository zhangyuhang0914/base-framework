import React from 'react'
import '@/assets/css/app.scss'
import { Button, ColorPicker } from 'antd'

const Dispatch: React.FC = () => {
  const [primary, setPrimary] = React.useState('#1677ff')

  return (
    <>
      <ColorPicker
        showText
        value={primary}
        onChange={color => setPrimary(color.toHexString())}
      />
      <Button type="primary">点击我</Button>
    </>
  )
}

export default Dispatch
