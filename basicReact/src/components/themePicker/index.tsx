import React, { useEffect, useState } from 'react'
import { ColorPicker, Tooltip, theme } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setPrimaryColor } from '@/redux/modules/global'
import type { Color } from 'antd/es/color-picker'
import type { RootState } from '@/redux'
import { ThemeUtils } from '@/utils/common/themeUtils'
import styled from 'styled-components'

const { useToken } = theme

const StyledThemePicker = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
`

const StyledLabel = styled.span`
  margin-right: 8px;
  font-size: 14px;
`

interface ThemePickerProps {
  label?: string
}

const ThemePicker: React.FC<ThemePickerProps> = ({ label = '主题色' }) => {
  const dispatch = useDispatch()
  const { token } = useToken()
  const { settingConf } = useSelector((state: RootState) => state.global)
  const [colorValue, setColorValue] = useState<Color | string>(settingConf.theme.primaryColor)

  // 初始化时从Redux获取主题色
  useEffect(() => {
    setColorValue(settingConf.theme.primaryColor)
  }, [])

  // 处理颜色变化
  const handleColorChange = (color: Color) => {
    setColorValue(color)
  }

  // 处理颜色选择完成
  const handleColorChangeComplete = (color: Color) => {
    const hexColor = color.toHexString()
    setColorValue(hexColor)
    
    // 更新Redux状态
    dispatch(setPrimaryColor(hexColor))
    
    // 更新CSS变量
    ThemeUtils.updateThemeColor(hexColor)
  }

  return (
    <StyledThemePicker>
      <Tooltip title={label}>
        <StyledLabel>{label}:</StyledLabel>
      </Tooltip>
      <ColorPicker
        value={colorValue}
        onChange={handleColorChange}
        onChangeComplete={handleColorChangeComplete}
        showText
      />
    </StyledThemePicker>
  )
}

export default ThemePicker