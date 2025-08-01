import React, { useState, useEffect } from 'react'
import { ColorPicker } from 'antd'
import type { Color } from 'antd/es/color-picker'
import { preferencesManager } from '@/config/preferencesManager'
import styled from 'styled-components'
import { UserRoundPen } from 'lucide-react'

const StyledThemePickerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-setting);
  justify-content: center;
`
const StyledBuiltinThemeItem = styled.div``
const StyledThemeColorCard = styled.div<{ $active?: boolean }>`
  cursor: pointer;
  outline: ${props =>
      props.$active ? 'var(--border-setting-active-width)' : 'var(--border-setting-width)'}
    solid ${props => (props.$active ? 'var(--color-primary)' : 'var(--border-color-default)')};
  border-radius: var(--border-radius-default);
  transition: outline-color 0.2s;
  &:hover {
    outline: var(--border-setting-active-width) solid var(--color-primary);
  }
`
const StyledColor = styled.div<{ color: string }>`
  border-radius: 50%;
  background-color: ${props => props.color};
`

const ThemePicker: React.FC = () => {
  const builtinThemeOptions = [
    { label: '默认', color: 'hsl(227.18deg 56.22% 54.31%)' },
    { label: '紫罗兰', color: 'hsl(245 82% 67%)' },
    { label: '樱花粉', color: 'hsl(347 77% 60%)' },
    { label: '柠檬黄', color: 'hsl(42 84% 61%)' },
    { label: '天蓝色', color: 'hsl(212 100% 45%)' },
    { label: '浅绿色', color: 'hsl(161 90% 43%)' },
    { label: '锌色灰', color: 'hsl(240 5% 26%)' },
    { label: '深绿色', color: 'hsl(181 84% 32%)' },
    { label: '深蓝色', color: 'hsl(211 91% 39%)' },
    { label: '橙黄色', color: 'hsl(18 89% 40%)' },
    { label: '玫瑰红', color: 'hsl(0 75% 42%)' },
    { label: '中性色', color: 'hsl(0 0% 25%)' },
    { label: '石板灰', color: 'hsl(215 25% 27%)' },
    { label: '中灰色', color: 'hsl(217 19% 27%)' }
  ]
  const [currentColor, setCurrentColor] = useState(preferencesManager.getTheme().colorPrimary)

  // 监听配置变化
  useEffect(() => {
    const unsubscribe = preferencesManager.addListener(preferences => {
      setCurrentColor(preferences.theme.colorPrimary)
    })
    return unsubscribe
  }, [])

  const isCustomColorActive = () => {
    const builtInColors = builtinThemeOptions.map(item => item.color)
    return !builtInColors.includes(currentColor)
  }
  const handleThemeColorChange = (color: string) => {
    preferencesManager.setPrimaryColor(color)
    setCurrentColor(color)
  }
  const handleCustomColorChange = (color: Color) => {
    const hexColor = color.toHexString()
    preferencesManager.setPrimaryColor(hexColor)
    setCurrentColor(hexColor)
  }

  return (
    <StyledThemePickerContainer className="flex w-full flex-wrap justify-between">
      {builtinThemeOptions.map(item => (
        <StyledBuiltinThemeItem
          key={item.color}
          className="flex cursor-pointer flex-col"
          onClick={() => handleThemeColorChange(item.color)}
        >
          <StyledThemeColorCard
            className="flex-center group cursor-pointer p-1"
            $active={currentColor === item.color}
          >
            <StyledColor className="mx-10 my-2 size-5 rounded-md" color={item.color}></StyledColor>
          </StyledThemeColorCard>
          <div className="mt-2 text-center text-xs text-text-muted-foreground">{item.label}</div>
        </StyledBuiltinThemeItem>
      ))}
      <ColorPicker value={currentColor} onChange={handleCustomColorChange}>
        <div className="flex cursor-pointer flex-col">
          <StyledThemeColorCard
            className="flex-center group cursor-pointer p-1"
            $active={isCustomColorActive()}
          >
            <UserRoundPen className="mx-10 my-2 size-5 rounded-md" width={24} height={24} />
          </StyledThemeColorCard>
          <div className="mt-2 text-center text-xs text-text-muted-foreground">自定义</div>
        </div>
      </ColorPicker>
    </StyledThemePickerContainer>
  )
}

export default ThemePicker
