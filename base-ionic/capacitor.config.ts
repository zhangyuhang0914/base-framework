import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.baseionic.myapp',
  appName: 'ionic-app-base',
  webDir: './dist-ionic',
  server: {
    androidScheme: 'https'
  },
  // 插件
  plugins: {
    // 启动画面
    SplashScreen: {
      launchShowDuration: 3000, // 显示启动初始屏幕的时间长度
      launchAutoHide: true, // 时间长度后自动隐藏启动画面
      launchFadeOutDuration: 3000, // 启动画面的淡出动画的持续时间仅适用于 Android（使用 Android 12 启动画面 API 时）
      backgroundColor: '#FFFFFF', // 启动屏幕的背景颜色
      // @ts-ignore
      androidSplash: 'drawable/splash.png', // 修改启动页图片路径
      androidSplashResourceName: 'splashFiringFrame', // 启动画面的资源的名称。使用 Android 12 API 时启动时不起作用。仅适用于 Android
      androidScaleType: 'CENTER_CROP', // ImageView.ScaleType用于缩放启动屏幕图像。useDialog如果为 true 或在使用 Android 12 API 时启动，则不起作用。仅适用于 Android
      showSpinner: true, // 在启动屏幕上显示加载微调器。useDialog如果为 true 或在使用 Android 12 API 时启动，则不起作用
      androidSpinnerStyle: 'large', // Android 旋转器的样式。useDialog如果为 true 或在使用 Android 12 API 时启动，则不起作用
      iosSpinnerStyle: 'small', // iOS 旋转器的样式。如果是 true 则不起作用useDialog
      spinnerColor: '#999999', // 十六进制格式的微调器颜色，#RRGGBB 或 #RRGGBBAA。useDialog如果为 true 或在使用 Android 12 API 时启动，则不起作用
      splashFullScreen: true, // 隐藏启动屏幕上的状态栏。使用 Android 12 API 时启动时不起作用。仅适用于 Android
      splashImmersive: true, // 隐藏启动屏幕上的状态栏和软件导航按钮。使用 Android 12 API 时启动时不起作用。仅适用于 Android
      layoutName: 'launch_screen', // 如果useDialog设置为 true，则配置对话框布局。如果useDialog未设置或为 false，则使用布局而不是 ImageView。使用 Android 12 API 时启动时不起作用。仅适用于 Android
      useDialog: true // 使用 Dialog 而不是 ImageView。如果layoutName未配置，它将使用使用初始图像作为背景的布局。使用 Android 12 API 时启动时不起作用。仅适用于 Android
    }
  }
}

export default config
