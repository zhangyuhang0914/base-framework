import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setAlgorithmTheme } from '@/redux/modules/global'
import type { AlgorithmTheme } from '@/redux/interface/global'
import { preferencesManager } from '@/config/preferencesManager'
import styled, { css } from 'styled-components'
import { MoonStar, SunMedium, SunMoonIcon } from 'lucide-react'
import type { ThemePreferences } from '@/config/types'

const StyledAlgorithmThemeSwitcher = styled.div`
  display: flex;
  gap: var(--gap-setting);
`
const StyledAlgorithmThemeSwitcherItem = styled.div`
  .icon-container {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .label {
    font-size: 12px;
  }
`
const StyledSwitcherItemCard = styled.div<{ $active: boolean }>`
  border-radius: var(--border-radius-default);
  outline: ${props =>
      props.$active ? 'var(--border-setting-active-width)' : 'var(--border-setting-width)'}
    solid var(--border-color-default);
  transition: outline-color 0.2s;
  ${({ $active }) =>
    $active &&
    css`
      outline-color: var(--color-primary);
    `}

  &:hover {
    outline: var(--border-setting-active-width) solid var(--color-primary);
  }
`

const algorithmThemeOptions = [
  { label: '默认', value: 'light', icon: SunMedium },
  { label: '暗黑', value: 'dark', icon: MoonStar },
  { label: '紧凑', value: 'compact', icon: SunMoonIcon }
]

const AlgorithmThemeSwitcher: React.FC = () => {
  const dispatch = useDispatch()
  const [currentTheme, setCurrentTheme] = useState(preferencesManager.getAlgorithmTheme())

  // 监听配置变化
  useEffect(() => {
    const unsubscribe = preferencesManager.addListener(preferences => {
      setCurrentTheme(preferences.algorithmTheme as ThemePreferences['mode'])
    })
    return unsubscribe
  }, [])

  const handleAlgorithmChange = (value: AlgorithmTheme) => {
    preferencesManager.setAlgorithmTheme(value)
    // 同步到 Redux
    dispatch(setAlgorithmTheme(value))
    setCurrentTheme(value)
  }

  return (
    <StyledAlgorithmThemeSwitcher>
      {algorithmThemeOptions.map(option => (
        <StyledAlgorithmThemeSwitcherItem
          className="flex w-full cursor-pointer flex-wrap justify-center"
          key={option.value}
          onClick={() => handleAlgorithmChange(option.value as AlgorithmTheme)}
        >
          <StyledSwitcherItemCard
            className="flex w-full items-center justify-center py-4"
            $active={currentTheme === option.value}
          >
            <option.icon />
          </StyledSwitcherItemCard>
          <div className="mt-2 text-center text-xs text-text-muted-foreground">{option.label}</div>
        </StyledAlgorithmThemeSwitcherItem>
      ))}
    </StyledAlgorithmThemeSwitcher>
  )
}

export default AlgorithmThemeSwitcher
