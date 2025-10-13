import { defineConfig, presetMini } from 'unocss'
import presetAttributify from '@unocss/preset-attributify'
import presetIcons from '@unocss/preset-icons'

// 自定义工具类
const customTools = {
  // 自定义断点
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  // 自定义颜色
  colors: {
    primary: '#1890ff',
    secondary: '#52c41a',
    warning: '#faad14',
    danger: '#f5222d',
    info: '#1890ff',
    success: '#52c41a',
    error: '#f5222d'
  }
}

export default defineConfig({
  // 预设配置
  presets: [
    presetAttributify(), // 支持属性化方式使用类名
    presetMini(), // 预设一些常用的原子类
    presetIcons({
      // 图标配置
      scale: 1.2, // 图标大小
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle'
      }
    })
  ],
  // 自定义规则
  rules: [
    // 添加自定义规则
    ['content-auto', { 'content-visibility': 'auto' }],
    ['scrollbar-hide', {
      'scrollbar-width': 'none',
      '-ms-overflow-style': 'none',
      '&::-webkit-scrollbar': 'display: none'
    }]
  ],
  // 自定义快捷方式
  shortcuts: {
    // 按钮样式
    'btn': 'px-4 py-2 rounded-md text-white font-medium transition-all duration-200',
    'btn-primary': 'bg-primary hover:bg-primary/90',
    'btn-secondary': 'bg-secondary hover:bg-secondary/90',
    'btn-danger': 'bg-danger hover:bg-danger/90',
    // 卡片样式
    'card': 'bg-white rounded-lg shadow-md p-4 transition-all duration-200 hover:shadow-lg',
    // 文本样式
    'text-balance': 'text-wrap balance',
    // 布局样式
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-col-center': 'flex flex-col items-center justify-center',
    // 间距样式
    'space-x-1': 'space-x-1',
    'space-x-2': 'space-x-2',
    'space-x-3': 'space-x-3',
    'space-y-1': 'space-y-1',
    'space-y-2': 'space-y-2',
    'space-y-3': 'space-y-3'
  },
  // 主题配置
  theme: {
    // 扩展主题
    extend: {
      colors: customTools.colors,
      screens: customTools.breakpoints
    }
  }
})
