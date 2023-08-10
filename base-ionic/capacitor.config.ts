import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.baseionic.myapp',
  appName: 'ionic-app-base',
  webDir: './dist-ionic',
  server: {
    androidScheme: 'https'
  }
}

export default config
