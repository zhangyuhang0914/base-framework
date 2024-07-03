const manifest = {
  manifest_version: 3,
  name: 'authAutoLogin 授权自动登录',
  description: '用于集成门户网站授权集成自动登录',
  version: '20240603',
  icons: {
    '16': 'images/icon/icon.png',
    '32': 'images/icon/icon.png',
    '48': 'images/icon/icon.png',
    '64': 'images/icon/icon.png',
    '128': 'images/icon/icon.png'
  },
  action: {
    default_title: 'authAutoLogin',
    default_popup: './index.html',
    default_icon: {
      '16': 'images/icon/icon.png',
      '32': 'images/icon/icon.png',
      '48': 'images/icon/icon.png',
      '64': 'images/icon/icon.png',
      '128': 'images/icon/icon.png'
    }
  },
  content_security_policy: {
    extension_pages:
      "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'; frame-ancestors 'none';"
  },
  externally_connectable: {
    ids: ['*']
  },
  host_permissions: ['http://*/*', 'https://*/*', '*://*/*', '<all_urls>'],
  permissions: [
    'storage',
    'tabs',
    'activeTab',
    'scripting',
    'declarativeNetRequest'
  ],
  background: {
    service_worker: 'background.ts',
    type: 'module'
  },
  content_scripts: [],
  commands: {
    _execute_action: {
      suggested_key: {
        windows: 'Alt+Shift+N',
        mac: 'Alt+Shift+N',
        chromeos: 'Alt+Shift+N',
        linux: 'Alt+Shift+N'
      }
    }
  }
  // options_page: './options.html'
}

export default manifest
