import React from 'react'
import styled from 'styled-components'
import Drawer from '@/components/antd/drawer'
import AlgorithmThemeSwitcher from '@/pages/layout/modules/appearance/algorithmThemeSwitcher'
import ThemePicker from '@/pages/layout/modules/appearance/themePicker'
import RadiusPicker from '@/pages/layout/modules/appearance/radiusPicker'
import { Button, Segmented } from 'antd'
import { CopyIcon, RotateCcw } from 'lucide-react'
import { preferencesManager } from '@/config/preferencesManager'
import { useDispatch } from 'react-redux'
import { syncFromPreferences } from '@/redux/modules/global'
import { useClipboard } from '@/hooks/useClipboard'
import { useGlobalNotification } from '@/components/antd'

interface SettingsProps {
  open: boolean
  onClose: () => void
}

const StyledDrawer = styled(Drawer)``
const StyledSettingsContent = styled.div`
  padding: 4px 0;
`
const StyledSettingSection = styled.div``
const StyledSegmentedControl = styled(Segmented)`
  width: 100%;
  .ant-segmented-group {
    display: grid;
    grid-template-columns: repeat(4, minmax(0px, 1fr));
    outline: none;
    .ant-segmented-item {
      width: 100%;
      padding: 2px 0;
      .ant-segmented-item-label {
        padding: 0 12px;
        font-size: var(--font-size-small);
      }
    }
  }
`
const StyledSectionTitle = styled.h3`
  font-size: var(--font-size-base);
  font-weight: bold;
  margin-bottom: 16px;
  color: var(--color-text-primary);
`
const StyledSectionContent = styled.div``

const Settings: React.FC<SettingsProps> = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<string>('appearance')
  const dispatch = useDispatch()
  const notification = useGlobalNotification()
  const { copy } = useClipboard()
  const SegmentedOptions = [
    {
      label: '外观',
      value: 'appearance'
    },
    {
      label: '布局',
      value: 'layout'
    },
    {
      label: '快捷键',
      value: 'shortcuts'
    },
    {
      label: '通用',
      value: 'general'
    }
  ]

  // 处理重置操作
  const handleReset = () => {
    try {
      preferencesManager.reset()
      // 同步到 Redux
      dispatch(syncFromPreferences())
      notification.success({
        placement: 'bottomRight',
        message: '重置成功',
        description: '偏好设置已重置为默认配置'
      })
    } catch (error) {
      notification.error({
        placement: 'bottomRight',
        message: '重置失败',
        description: '重置偏好设置时发生错误'
      })
    }
  }
  // 处理复制配置
  const handleCopySettings = async () => {
    try {
      const configJson = preferencesManager.exportPreferences()
      await copy({
        text: configJson,
        placement: 'bottomRight',
        successMessage: '复制成功',
        errorMessage: '剪贴板不支持',
        notificationContent: '复制成功，请在 app 下的 `src/config/defaultPreferences.ts`内进行覆盖'
      })
    } catch (error) {
      notification.error({
        placement: 'bottomRight',
        message: '复制失败',
        description: `导出偏好设置时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      })
    }
  }

  // 抽屉标题
  const headerContent = (
    <>
      <h2 className="text-foreground text-left font-bold">偏好设置</h2>
      <p className="mt-1 text-xs text-text-muted-foreground">自定义偏好设置 & 实时预览</p>
    </>
  )
  // 抽屉底部按钮
  const footerContent = (
    <>
      <Button type="primary" className="mx-4 w-full font-medium" onClick={handleCopySettings}>
        <CopyIcon width={12} height={12} />
        复制偏好设置
      </Button>
      <Button type="text" className="mx-4 w-full font-medium" onClick={handleReset}>
        <RotateCcw width={12} height={12} />
        重置偏好设置
      </Button>
    </>
  )

  return (
    <>
      <StyledDrawer
        className="w-96"
        placement="right"
        onClose={onClose}
        open={open}
        headerContent={headerContent}
        showHeader={true}
        footerContent={footerContent}
        showFooter={true}
        onReset={handleReset}
      >
        <StyledSettingsContent>
          <StyledSegmentedControl
            options={SegmentedOptions}
            value={activeTab}
            onChange={value => setActiveTab(value as string)}
          />
          {activeTab === 'appearance' && (
            <div>
              <StyledSettingSection className="flex flex-col py-4">
                <StyledSectionTitle className="mb-3 font-bold leading-none tracking-tight">
                  主题
                </StyledSectionTitle>
                <StyledSectionContent>
                  <AlgorithmThemeSwitcher />
                </StyledSectionContent>
              </StyledSettingSection>
              <StyledSettingSection className="flex flex-col py-4">
                <StyledSectionTitle className="mb-3 font-bold leading-none tracking-tight">
                  内置主题
                </StyledSectionTitle>
                <StyledSectionContent>
                  <ThemePicker />
                </StyledSectionContent>
              </StyledSettingSection>
              <StyledSettingSection className="flex flex-col py-4">
                <StyledSectionTitle className="mb-3 font-bold leading-none tracking-tight">
                  圆角
                </StyledSectionTitle>
                <StyledSectionContent>
                  <RadiusPicker />
                </StyledSectionContent>
              </StyledSettingSection>
            </div>
          )}
          {activeTab === 'layout' && (
            <StyledSettingSection>{/* 布局设置内容将在未来实现 */}</StyledSettingSection>
          )}
          {activeTab === 'shortcuts' && (
            <StyledSettingSection>{/* 快捷键设置内容将在未来实现 */}</StyledSettingSection>
          )}
          {activeTab === 'general' && (
            <StyledSettingSection>{/* 通用设置内容将在未来实现 */}</StyledSettingSection>
          )}
        </StyledSettingsContent>
      </StyledDrawer>
    </>
  )
}

export default Settings
