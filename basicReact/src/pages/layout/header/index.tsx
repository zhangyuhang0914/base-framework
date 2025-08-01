import React, { useState } from 'react'
import { Button } from 'antd'
import styled from 'styled-components'
import { Icon } from '@iconify/react/dist/iconify.js'
import Widgets from '../components/widgets'

interface HeaderProps {
  className?: string
}

const StyledLayoutHeader = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`
const StyledSettingBtn = styled(Button)``

const LayoutHeader: React.FC<HeaderProps> = () => {
  const [settingsOpen, setSettingsOpen] = useState(false)
  // 打开设置抽屉
  const handleOpenSettings = () => {
    setSettingsOpen(true)
  }
  // 关闭设置抽屉
  const handleCloseSettings = () => {
    setSettingsOpen(false)
  }

  return (
    <StyledLayoutHeader className="layoutHeader">
      <HeaderLeft>
        <Button type="primary">我是头部</Button>
      </HeaderLeft>
      <HeaderRight>
        <StyledSettingBtn
          type="text"
          shape="circle"
          icon={<Icon icon="tdesign:setting-1" />}
          onClick={handleOpenSettings}
        />
        <Widgets open={settingsOpen} onClose={handleCloseSettings} />
      </HeaderRight>
    </StyledLayoutHeader>
  )
}

export default LayoutHeader
