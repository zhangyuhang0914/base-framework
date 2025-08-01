import React, { useState, useEffect } from 'react'
import { preferencesManager } from '@/config/preferencesManager'
import styled from 'styled-components'
import { Button } from 'antd'

const StyledRadiusPickerContainer = styled.div``
const StyledRadiusItem = styled(Button)`
  && {
    border-radius: var(--border-radius-default);
  }
`

const RadiusPicker: React.FC = () => {
  const radiusOptions = [
    { label: '0', value: '0', radius: '0px' },
    { label: '0.25', value: '0.25', radius: '2px' },
    { label: '0.5', value: '0.5', radius: '6px' },
    {
      label: '0.75',
      value: '0.75',
      radius: '10px'
    },
    { label: '1', value: '1', radius: '14px' }
  ]
  const [currentRadius, setCurrentRadius] = useState(preferencesManager.getTheme().radius)

  // 监听配置变化
  useEffect(() => {
    const unsubscribe = preferencesManager.addListener(preferences => {
      setCurrentRadius(preferences.theme.radius)
    })
    return unsubscribe
  }, [])

  const handleRadiusChange = (value: string) => {
    // 更新CSS变量，按比例计算不同尺寸的圆角
    const numValue = parseFloat(value)
    const baseValue = numValue * 16 // 将value转换为像素值
    const root = document.documentElement
    root.style.setProperty('--border-radius-none', '0px')
    root.style.setProperty('--border-radius-xs', `${baseValue * 0.25}px`)
    root.style.setProperty('--border-radius-sm', `${baseValue * 0.5}px`)
    root.style.setProperty('--border-radius-md', `${baseValue * 0.75}px`)
    root.style.setProperty('--border-radius-lg', `${baseValue * 1.25}px`)
    root.style.setProperty('--border-radius-default', `${baseValue}px`)

    // 更新配置管理器
    preferencesManager.setRadius(value)
    setCurrentRadius(value)
  }

  return (
    <StyledRadiusPickerContainer className="justify-space-between flex items-center gap-2">
      {radiusOptions.map(option => (
        <StyledRadiusItem
          className="h-7 w-16 rounded-sm px-2 shadow-sm"
          key={option.value}
          type={currentRadius === option.value ? 'primary' : 'default'}
          onClick={() => handleRadiusChange(option.value)}
        >
          <div className="font-medium">{option.label}</div>
        </StyledRadiusItem>
      ))}
    </StyledRadiusPickerContainer>
  )
}

export default RadiusPicker
