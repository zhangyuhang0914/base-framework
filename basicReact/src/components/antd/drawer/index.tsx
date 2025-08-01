import React, { type ReactNode } from 'react'
import { Drawer as AntdDrawer, Button, type DrawerProps as AntdDrawerProps } from 'antd'
import { RotateCw, X } from 'lucide-react'
import styled from 'styled-components'
import { themeVariables } from '@/constants/theme'

// 扩展Antd的Drawer属性
export interface DrawerProps extends AntdDrawerProps {
  // 头部内容
  headerContent?: ReactNode
  // 是否显示头部
  showHeader?: boolean
  // 底部内容
  footerContent?: ReactNode
  // 是否显示底部
  showFooter?: boolean
  // 内容
  children?: ReactNode
  // 重置回调
  onReset?: () => void
}

const StyledDrawer = styled(AntdDrawer)`
  .ant-drawer-content {
    border-left: 1px solid ${themeVariables.border.colorDefault};
  }

  && {
    .ant-drawer-header {
      padding: 12px 16px;
    }
    .ant-drawer-body {
      padding: 12px;
    }
    .ant-drawer-footer {
      width: 100%;
      padding: 8px 12px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-small);
      & button {
        font-size: var(--font-size-xs);
      }
    }
  }
`

const Drawer: React.FC<DrawerProps> = ({
  headerContent,
  showHeader = false,
  footerContent,
  showFooter = false,
  children,
  onReset,
  ...restProps
}) => {
  const HeaderComponents = (
    <div className="!flex flex flex-row items-center justify-between text-center sm:text-left">
      <div className="flex items-center">{headerContent}</div>
      <div className="flex-center">
        <Button
          className="px-1"
          type="text"
          shape="circle"
          icon={<RotateCw size={16} />}
          onClick={() => {
            onReset?.()
          }}
        ></Button>
        <Button
          className="ml-[2px] px-1 opacity-80"
          type="text"
          shape="circle"
          icon={<X size={16} />}
          onClick={restProps?.onClose}
        ></Button>
      </div>
    </div>
  )
  const FooterComponents = (
    <div className="flex w-full items-center justify-around">{footerContent}</div>
  )

  return (
    <StyledDrawer
      {...restProps}
      width={384}
      closeIcon={false}
      title={showHeader && HeaderComponents}
      footer={showFooter && FooterComponents}
    >
      {children}
    </StyledDrawer>
  )
}

export default Drawer
