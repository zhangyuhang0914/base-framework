const manifest = {
  manifest_version: 3,
  name: 'scriptInject 脚本注入',
  description: '用于集成门户网站授权集成自动登录的脚本注入',
  version: '20240606',
  icons: {
    '16': 'images/icon/icon.png',
    '32': 'images/icon/icon.png',
    '48': 'images/icon/icon.png',
    '64': 'images/icon/icon.png',
    '128': 'images/icon/icon.png'
  },
  action: {
    default_title: 'scriptInject',
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
    // "script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval'; object-src 'self'; frame-ancestors 'none';"
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
  content_scripts: [
    {
      js: ['content_scripts/content_scripts.ts'],
      matches: ['<all_urls>']
    }
  ],
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
