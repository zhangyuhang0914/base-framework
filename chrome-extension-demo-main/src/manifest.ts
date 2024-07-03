const manifest = {
  manifest_version: 3,
  name: 'webCheck 网站检测',
  description: '用于网站检测的chrome插件',
  version: '1.0',
  icons: {
    '16': 'icon/icon.png',
    '32': 'icon/icon.png',
    '48': 'icon/icon.png',
    '64': 'icon/icon.png',
    '128': 'icon/icon.png'
  },
  action: {
    default_title: 'webCheck',
    default_popup: './index.html',
    default_icon: {
      '16': 'icon/icon.png',
      '32': 'icon/icon.png',
      '48': 'icon/icon.png',
      '64': 'icon/icon.png',
      '128': 'icon/icon.png'
    }
  },
  content_security_policy: {
    extension_pages:
      "script-src 'self'; object-src 'self'; frame-ancestors 'none';"
  },
  externally_connectable: {
    ids: ['*']
  },
  permissions: ['storage', 'activeTab', 'scripting', 'tabs'],
  background: {
    service_worker: './background.ts',
    type: 'module'
  },
  content_scripts: [
    {
      matches: ['http://192.168.1.246:8080/*'],
      js: ['background.ts']
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
  },
  options_page: './options.html'
}

export default manifest
