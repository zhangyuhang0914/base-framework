/* eslint-disable */
/*
 --------------------------------------------------------------
 * FileName:xtxsync.js
 * This Javascript provides synchronous interfaces
 * Support bjca client version 3.4.1 and later
 * Author:BJCA-zys
 * Date: 2021-05-06
 *
 --------------------------------------------------------------
 */
; (function () {
  if (typeof window.xtxsync === 'undefined') {
    window.xtxsync = {}
  }
})()

  // initialize xtxsync hashMap object
  ; (function () {
    function xtxsyncHashMap () {
      this.map = {}
    }

    xtxsyncHashMap.prototype = {
      put: function (key, value) {
        this.map[key] = value
      },

      get: function (key) {
        if (this.map.hasOwnProperty(key)) {
          return this.map[key]
        }
        return null
      },

      remove: function (key) {
        if (this.map.hasOwnProperty(key)) {
          return delete this.map[key]
        }
        return false
      },

      removeAll: function () {
        this.map = {}
      },

      keySet: function () {
        var _keys = []
        for (var i in this.map) {
          _keys.push(i)
        }
        return _keys
      }
    }

    xtxsyncHashMap.prototype.constructor = xtxsyncHashMap

    xtxsync.HashMap = xtxsyncHashMap
  })()

  // initialize xtxsync util object
  ; (function () {
    function initUtilObject (xtxsync) {
      var util = (xtxsync.util = xtxsync.util || {})

      util.checkBrowserISIE = function () {
        return !!window.ActiveXObject || 'ActiveXObject' in window ? true : false
      }

      util.checkLocationIsHttps = function () {
        return 'https:' == document.location.protocol ? true : false
      }

      util.evalFunction = function (func) {
        if (typeof func === 'function') {
          return func
        } else if (typeof func === 'string') {
          cb = eval(func)
        } else {
          return null
        }
      }

      util.consolelog = function (param) {
        if (window.console == undefined || window.console.log == undefined) {
          return
        }
        console.log(param)
      }

      util.isEmpty = function (param) {
        if (!param) {
          return true
        }
        if (typeof param == 'string' && param == '') {
          return true
        }

        return false
      }

      util.loadIECtl = function (clsid, ctlName, checkFunc) {
        if (!util.checkBrowserISIE()) {
          return null
        }
        var ctl = document.getElementById(ctlName)
        if (ctl) {
          return ctl
        }
        try {
          var loadObjString =
            '<object id="' +
            ctlName +
            '" classid="CLSID:' +
            clsid +
            '" style="HEIGHT:0px; WIDTH:0px">'
          loadObjString += '</object>'
          document.write(loadObjString)
          if (
            checkFunc != null &&
            checkFunc != '' &&
            eval(ctlName + '.' + checkFunc) == undefined
          ) {
            return null
          }
        } catch (e) {
          util.consolelog(e)
          return null
        }
        return document.getElementById(ctlName)
      }

      util.getAutoExecFunctionString = function (func) {
        var ret = '('
        ret += func.toString()
        ret += ')()'

        return ret
      }

      util.attachIEEvent = function (ctlName, eventName, eventFunc) {
        var ctl
        if (typeof ctlName === 'string') {
          ctl = eval(ctlName)
        } else {
          ctl = ctlName
        }
        eventName = eventName.toLowerCase()

        var cb = util.evalFunction(eventFunc)
        if (cb == null) {
          return
        }

        if (ctl.attachEvent) {
          ctl.attachEvent(eventName, cb)
        } else {
          // IE11 not support attachEvent, and addEventListener do not work well, so addEvent ourself
          var handler = document.createElement('script')
          handler.setAttribute('for', ctlName)
          handler.setAttribute('event', eventName)
          var eventScript = util.getAutoExecFunctionString(eventFunc)
          handler.appendChild(document.createTextNode(eventScript))
          document.getElementsByTagName('head')[0].appendChild(handler)
        }
      }

      util.loadWebSocketCtl = function (wsUrl, wssUrl) {
        if (xtxsync.wsObject) {
          return xtxsync.wsObject
        }
        var url
        if (util.checkLocationIsHttps()) {
          url = 'wss://' + wssUrl
        } else {
          url = 'ws://' + wsUrl
        }

        var wsObject = {
          socket: undefined,
          wsEventQueue: new xtxsync.HashMap(),
          wsURL: url
        }
        xtxsync.wsObject = wsObject
        xtxsync.wsObject.wsEventQueue.put(
          'onusbkeychange',
          util.evalFunction(xtxsync.custom.defaultUsbkeyChange)
        )

        try {
          wsObject.socket = new WebSocket(url) || null
        } catch (e) {
          util.consolelog(e)
          return null
        }

        wsObject.socket.onopen = function (evt) {
          xtxsync.util.consolelog('open websocket[' + url + '] ok...')
          xtxsync.util.consolelog(
            'SOF_GetVersion:(' + xtxsync.SOF_GetVersion() + ')'
          )
        }
        wsObject.socket.onclose = function (evt) {
          util.consolelog('websocket[' + url + '] closed, reopen it...')
          xtxsync.wsObject = undefined
          xtxsync.XTXAppWebSocket = xtxsync.util.loadWebSocketCtl(wsUrl, wssUrl)
        }
        wsObject.socket.onmessage = function (evt) {
          var eventCmd = false
          if (xtxsync.util.isEmpty(evt.data)) {
            util.consolelog('onmessage evt.data is NULL or empty!!!')
            return
          }
          try {
            var res = JSON.parse(evt.data)
            var cmdId = undefined
            if (res['call_cmd_id']) {
              cmdId = res['call_cmd_id']
            } else {
              util.consolelog('return JSON not include call_cmd_id!!!')
              return
            }

            var retVal = ''
            if (res['retVal']) {
              retVal = res['retVal']
            } else if (res['retValue']) {
              retVal = res['retValue']
            }

            var execFunc = xtxsync.wsObject.wsEventQueue.get(cmdId.toLowerCase())
            if (execFunc && typeof execFunc == 'function') {
              // event
              execFunc(retVal)
            }
          } catch (e) {
            return
          }
        }
        wsObject.socket.onerror = function (evt) {
          xtxsync.util.consolelog(evt.data)
        }

        return wsObject
      }

      util.attachWebSocketEvent = function (wsObject, eventName, eventFunc) {
        if (wsObject == null) {
          return
        }
        wsObject.wsEventQueue.put(
          eventName.toLowerCase(),
          util.evalFunction(eventFunc)
        )
      }

      util.createHttpRequest = function () {
        if (window.XMLHttpRequest) {
          return new XMLHttpRequest()
        } else {
          return new ActiveXObject('Microsoft.XMLHTTP')
        }
      }

      util.ajaxSyncall = function (clsid, methodName, outPramType, argsArray) {
        var defaultErrRet
        if (outPramType == 'bool') {
          defaultErrRet = false
        } else if (outPramType == 'number') {
          defaultErrRet = -1
        } else {
          defaultErrRet = ''
        }
        try {
          var xhr = xtxsync.util.createHttpRequest()
          var strUrl = 'http://127.0.0.1:21051/synctl'
          if (util.checkLocationIsHttps()) {
            strUrl = 'https://127.0.0.1:21061/synctl'
          }
          xhr.open('POST', strUrl, false)
          xhr.setRequestHeader('Content-type', 'application/json')
          var sendArray = {
            url: window.location.href,
            clsid: clsid,
            func: methodName,
            param: argsArray
          }
          var token = xtxsync.custom.getToken()
          if (token != '') {
            sendArray.token = token
          }

          xhr.send(JSON.stringify(sendArray))
          if (xhr.status != 200) {
            if (methodName == 'SOF_Login' || methodName == 'SOF_LoginEx') {
              xtxsync.custom.setToken('')
            }
            return defaultErrRet
          }

          var res = JSON.parse(xhr.responseText)
          if (res.token) {
            xtxsync.custom.setToken(res.token)
          }

          var ret = defaultErrRet
          if (res.hasOwnProperty('retValue')) {
            ret = res.retValue
          } else if (res.hasOwnProperty('retVal')) {
            if (outPramType == 'bool') {
              if (typeof res.retVal == 'string') {
                ret = res.retVal == 'true' ? true : false
              } else {
                ret = res.retVal
              }
            } else if (outPramType == 'number') {
              if (typeof res.retVal == 'string') {
                ret = Number(res.retVal)
              } else {
                ret = res.retVal
              }
            } else {
              ret = res.retVal
            }
          }
          if (ret == undefined) {
            ret = defaultErrRet
          }
          if (
            ((methodName == 'SOF_Login' || methodName == 'SOF_LoginEx') &&
              !ret) ||
            (methodName == 'SOF_Logout' && ret)
          ) {
            xtxsync.custom.setToken('')
          }
          return ret
        } catch (e) {
          return defaultErrRet
        }
      }
    }

    return initUtilObject(xtxsync)
  })()

  // initialize index page and other custom action
  ; (function () {
    function initCustomActions (xtxsync) {
      var custom = (xtxsync.custom = xtxsync.custom || {})

      custom.softCertListID = ''
      custom.hardCertListID = ''
      custom.allCertListID = ''
      custom.loginCertID = ''
      custom.logoutFunc = null
      custom.UsbkeyChangeFunc = null
      custom.loginToken = ''

      custom.errorReportFunc = function (msg) {
        alert(msg)
      }

      custom.setAutoLogoutParameter = function (strCertID, logoutFunc) {
        var custom = xtxsync.custom
        custom.loginCertID = strCertID
        custom.logoutFunc = logoutFunc
      }

      custom.clearDropList = function (dropListId) {
        if (dropListId == '') {
          return
        }

        var obj = document.getElementById(dropListId)
        if (obj == undefined) {
          obj = eval(dropListId)
        }
        if (obj == undefined) {
          return
        }

        var i,
          n = obj.length
        for (i = 0; i < n; i++) {
          obj.remove(0)
        }
      }

      custom.pushOneDropListBox = function (userListArray, strListID) {
        var obj = document.getElementById(strListID)
        if (obj == undefined) {
          obj = eval(strListID)
        }
        if (obj == undefined) {
          return
        }

        for (var i = 0; i < userListArray.length; i++) {
          var certObj = userListArray[i]
          var objItem = new Option(certObj.certName, certObj.certID)
          obj.options.add(objItem)
        }
        return
      }

      custom.pushUserListToAllDroplist = function (strUserList) {
        var custom = xtxsync.custom

        custom.clearDropList(custom.softCertListID)
        custom.clearDropList(custom.hardCertListID)
        custom.clearDropList(custom.allCertListID)

        var allListArray = []
        while (true) {
          var i = strUserList.indexOf('&&&')
          if (i <= 0) {
            break
          }
          var strOneUser = strUserList.substring(0, i)
          var strName = strOneUser.substring(0, strOneUser.indexOf('||'))
          var strCertID = strOneUser.substring(
            strOneUser.indexOf('||') + 2,
            strOneUser.length
          )
          allListArray.push({ certName: strName, certID: strCertID })

          if (custom.hardCertListID != '') {
            var devType = xtxsync.GetDeviceInfo(strCertID, 7)
            if (devType == 'HARD') {
              custom.pushOneDropListBox(
                [{ certName: strName, certID: strCertID }],
                custom.hardCertListID
              )
            }
          }

          if (custom.softCertListID != '') {
            var devType = xtxsync.GetDeviceInfo(strCertID, 7)
            if (devType == 'SOFT') {
              custom.pushOneDropListBox(
                [{ certName: strName, certID: strCertID }],
                custom.softCertListID
              )
            }
          }
          var len = strUserList.length
          strUserList = strUserList.substring(i + 3, len)
        }

        if (custom.allCertListID != '') {
          custom.pushOneDropListBox(allListArray, custom.allCertListID)
        }
      }

      custom.setUserCertList = function (certListId, certType) {
        var custom = xtxsync.custom

        if (certType == CERT_TYPE_ALL || certType == undefined) {
          custom.allCertListID = certListId
        }

        if (certType == CERT_TYPE_HARD) {
          custom.hardCertListID = certListId
        }

        if (certType == CERT_TYPE_SOFT) {
          custom.softCertListID = certListId
        }
        custom.pushUserListToAllDroplist(xtxsync.SOF_GetUserList())
      }

      custom.setOnUsbKeyChangeCallBack = function (callback) {
        xtxsync.custom.UsbkeyChangeFunc = callback
      }

      custom.setErrorReportFunc = function (errFunc) {
        xtxsync.custom.errorReportFunc = errFunc
      }

      custom.autoLogoutCallBack = function (strUserList) {
        var custom = xtxsync.custom
        if (strUserList.indexOf(custom.loginCertID) <= 0) {
          custom.logoutFunc()
        }
      }

      custom.defaultUsbkeyChange = function () {
        var custom = xtxsync.custom
        custom.pushUserListToAllDroplist(xtxsync.SOF_GetUserList())

        if (typeof custom.UsbkeyChangeFunc == 'function') {
          custom.UsbkeyChangeFunc()
        }

        if (custom.loginCertID != '' && typeof custom.logoutFunc == 'function') {
          custom.autoLogoutCallBack(xtxsync.SOF_GetUserList())
        }
      }

      custom.getToken = function () {
        return custom.loginToken
      }

      custom.setToken = function (token) {
        custom.loginToken = token
      }
    }

    return initCustomActions(xtxsync)
  })()

  // initialize xtxappcom object
  ; (function () {
    function initXTXAppCOM (xtxsync) {
      var util = xtxsync.util
      var custom = xtxsync.custom

      xtxsync.XTXAppCOM = util.loadIECtl(
        xtxsync.xtx_clsid,
        'XTXAppObj',
        'SOF_GetVersion()'
      )
      if (xtxsync.XTXAppCOM == null) {
        custom.errorReportFunc(
          '加载XTXAppCOM控件失败，请确认已正确安装BJCA证书应用环境!'
        )
        return false
      }
      var XTXAppCOM = xtxsync.XTXAppCOM

      util.attachIEEvent(
        'XTXAppObj',
        'onUsbkeyChange',
        xtxsync.custom.defaultUsbkeyChange
      )

      // get key pic interface
      var GetPicObj = util.loadIECtl(
        xtxsync.getpic_clsid,
        'GetPicObj',
        "Hash('0')"
      )
      if (GetPicObj == null) {
        //custom.errorReportFunc("加载GetKeyPic控件失败，请确认已正确安装GetKeyPic控件!");
      } else {
        XTXAppCOM.GetPic = function (strCertID) {
          return GetPicObj.GetPic(strCertID)
        }
        XTXAppCOM.Hash = function (inData) {
          return GetPicObj.Hash(inData)
        }
        XTXAppCOM.ConvertPicFormat = function (inData, type) {
          return GetPicObj.ConvertPicFormat(inData, type)
        }
        XTXAppCOM.ConvertGif2Jpg = function (inData) {
          return GetPicObj.ConvertGif2Jpg(inData)
        }
        XTXAppCOM.GetPic1 = function (strCertID) {
          return GetPicObj.GetPic1(strCertID)
        }
        XTXAppCOM.ConvertPicSize = function (strPicture, w, h) {
          return GetPicObj.ConvertPicSize(strPicture, w, h)
        }
      }

      // xtxversion interface
      var XTXVersionOBJ = util.loadIECtl(
        xtxsync.xtx_version_clsid,
        'XTXVersionOBJ',
        'GetEnvVersion()'
      )
      if (XTXVersionOBJ == null) {
        //custom.errorReportFunc("加载XTXVersion控件失败，请确认已正确安装证书应用环境!");
      } else {
        XTXAppCOM.GetEnvVersion = function () {
          return XTXVersionOBJ.GetEnvVersion()
        }
      }

      return true
    }

    function initXTXAppWebSocket (xtxsync) {
      xtxsync.XTXAppWebSocket = xtxsync.util.loadWebSocketCtl(
        '127.0.0.1:21051/xtxapp/',
        '127.0.0.1:21061/xtxapp/'
      )
      if (xtxsync.XTXAppWebSocket == null) {
        custom.errorReportFunc(
          '连接XTXAppCOM服务失败，请确认已正确安装BJCA证书应用环境!'
        )
        return false
      }

      return true
    }

    function initXTXAppObject (xtxsync) {
      var util = xtxsync.util
      xtxsync.xtx_clsid = '3F367B74-92D9-4C5E-AB93-234F8A91D5E6'
      xtxsync.getpic_clsid = '3BC3C868-95B5-47ED-8686-E0E3E94EF366'
      xtxsync.xtx_version_clsid = '574887FB-22A5-488B-A49C-2CF25F56BE68'
      var getImplmentFunction

      if (util.checkBrowserISIE()) {
        // IE
        if (!initXTXAppCOM(xtxsync)) {
          return false
        }
        getImplmentFunction = function (methodInfo) {
          if (methodInfo.inParams == '') {
            // 0 input param
            window[methodInfo.funcName] = new Function(
              'return xtxsync.XTXAppCOM.' + methodInfo.funcName + '();'
            )
          } else {
            window[methodInfo.funcName] = new Function(
              methodInfo.inParams,
              'return xtxsync.XTXAppCOM.' +
              methodInfo.funcName +
              '(' +
              methodInfo.inParams +
              ');'
            )
          }
        }
      } else {
        // other brower
        if (!initXTXAppWebSocket(xtxsync)) {
          return false
        }
        getImplmentFunction = function (methodInfo) {
          if (methodInfo.inParams == '') {
            // 0 input param
            window[methodInfo.funcName] = new Function(
              "return xtxsync.util.ajaxSyncall('" +
              methodInfo.clsid +
              "', '" +
              methodInfo.funcName +
              "', '" +
              methodInfo.outParamType +
              "');"
            )
          } else {
            window[methodInfo.funcName] = new Function(
              methodInfo.inParams,
              "return xtxsync.util.ajaxSyncall('" +
              methodInfo.clsid +
              "', '" +
              methodInfo.funcName +
              "','" +
              methodInfo.outParamType +
              "', [" +
              methodInfo.inParams +
              ']);'
            )
          }
        }
      }

      var export_functions = [
        {
          funcName: 'SOF_SetSignMethod',
          inParams: 'SignMethod',
          outParamType: 'number',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'SetSignMethod'
        },
        {
          funcName: 'SOF_GetSignMethod',
          inParams: '',
          outParamType: 'number',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SetEncryptMethod',
          inParams: 'EncryptMethod',
          outParamType: 'number',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_GetEncryptMethod',
          inParams: '',
          outParamType: 'number',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_GetUserList',
          inParams: '',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'GetUserList'
        },
        {
          funcName: 'SOF_ExportUserCert',
          inParams: 'CertID',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'GetSignCert'
        },
        {
          funcName: 'SOF_Login',
          inParams: 'CertID, PassWd',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'VerifyUserPIN'
        },
        {
          funcName: 'SOF_GetPinRetryCount',
          inParams: 'CertID',
          outParamType: 'number',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'GetUserPINRetryCount'
        },
        {
          funcName: 'SOF_ChangePassWd',
          inParams: 'CertID, oldPass, newPass',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'ChangeUserPassword'
        },
        {
          funcName: 'SOF_GetCertInfo',
          inParams: 'Cert, type',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'GetCertBasicinfo'
        },
        {
          funcName: 'SOF_GetCertInfoByOid',
          inParams: 'Cert, Oid',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'GetExtCertInfoByOID'
        },
        {
          funcName: 'SOF_SignData',
          inParams: 'CertID, InData',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'SignedData'
        },
        {
          funcName: 'SOF_VerifySignedData',
          inParams: 'Cert, InData, SignValue',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'VerifySignedData'
        },
        {
          funcName: 'SOF_SignFile',
          inParams: 'CertID, InFile',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'SOF_SignFile'
        },
        {
          funcName: 'SOF_VerifySignedFile',
          inParams: 'Cert, InFile, SignValue',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'VerifySignFile'
        },
        {
          funcName: 'SOF_EncryptData',
          inParams: 'Cert, InData',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'EncodeP7Enveloped'
        },
        {
          funcName: 'SOF_DecryptData',
          inParams: 'CertID, InData',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'DecodeP7Enveloped'
        },
        {
          funcName: 'SOF_EncryptFile',
          inParams: 'Cert, InFile, OutFile',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_DecryptFile',
          inParams: 'CertID, InFile, OutFile',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SignMessage',
          inParams: 'dwFlag, CertID, InData',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_VerifySignedMessage',
          inParams: 'MessageData, InData',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'VerifyDatabyP7'
        },
        {
          funcName: 'SOF_GetInfoFromSignedMessage',
          inParams: 'SignedMessage, type',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SignDataXML',
          inParams: 'CertID, InData',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_VerifySignedDataXML',
          inParams: 'InData',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_GetXMLSignatureInfo',
          inParams: 'XMLSignedData, type',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_GenRandom',
          inParams: 'RandomLen',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'GenerateRandom'
        },
        {
          funcName: 'SOF_PubKeyEncrypt',
          inParams: 'Cert, InData',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'PubKeyEncrypt'
        },
        {
          funcName: 'SOF_PriKeyDecrypt',
          inParams: 'CertID, InData',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'PriKeyDecrypt'
        },
        {
          funcName: 'SOF_SecertSegment',
          inParams: 'Secert, m, n, k',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SecertRecovery',
          inParams: 'Seg',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_GetLastError',
          inParams: '',
          outParamType: 'number',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'GetDeviceCount',
          inParams: '',
          outParamType: 'number',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'GetAllDeviceSN',
          inParams: '',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'GetDeviceSNByIndex',
          inParams: 'iIndex',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'GetDeviceInfo',
          inParams: 'sDeviceSN, iType',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'ChangeAdminPass',
          inParams: 'sDeviceSN, sOldPass, sNewPass',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'UnlockUserPass',
          inParams: 'sDeviceSN, sAdminPass, sNewUserPass',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'GenerateKeyPair',
          inParams: 'sDeviceSN, sContainerName, iKeyType, bSign',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'ExportPubKey',
          inParams: 'sDeviceSN, sContainerName, bSign',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'ImportSignCert',
          inParams: 'sDeviceSN, sContainerName, sCert',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'ImportEncCert',
          inParams: 'sDeviceSN, sContainerName, sCert, sPriKeyCipher',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'ReadFile',
          inParams: 'sDeviceSN, sFileName',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'readFile'
        },
        {
          funcName: 'WriteFile',
          inParams: 'sDeviceSN, sFileName, sContent, bPrivate',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'writeFile'
        },
        {
          funcName: 'IsContainerExist',
          inParams: 'sDeviceSN, sContainerName',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'DeleteContainer',
          inParams: 'sDeviceSN, sContainerName',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'ExportPKCS10',
          inParams: 'sDeviceSN, sContainerName, sDN, bSign',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'InitDevice',
          inParams: 'sDeviceSN, sAdminPass',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'AddSignInfo',
          inParams: 'sUserPass',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_GetVersion',
          inParams: '',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_ExportExChangeUserCert',
          inParams: 'CertID',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'GetExchCert'
        },
        {
          funcName: 'SOF_ValidateCert',
          inParams: 'Cert',
          outParamType: 'number',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'ValidateCert'
        },
        {
          funcName: 'GetENVSN',
          inParams: 'sDeviceSN',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SetENVSN',
          inParams: 'sDeviceSN, sEnvsn',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'IsDeviceExist',
          inParams: 'sDeviceSN',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'GetContainerCount',
          inParams: 'sDeviceSN',
          outParamType: 'number',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SymEncryptData',
          inParams: 'sKey, indata',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'EncryptData'
        },
        {
          funcName: 'SOF_SymDecryptData',
          inParams: 'sKey, indata',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'DecryptData'
        },
        {
          funcName: 'SOF_SymEncryptFile',
          inParams: 'sKey, inFile, outFile',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'EncryptFile'
        },
        {
          funcName: 'SOF_SymDecryptFile',
          inParams: 'sKey, inFile, outFile',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'DecryptFile'
        },
        {
          funcName: 'SOF_GetLastErrMsg',
          inParams: '',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_Base64Encode',
          inParams: 'sIndata',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_Base64Decode',
          inParams: 'sIndata',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_HashData',
          inParams: 'hashAlg, sInData',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_HashFile',
          inParams: 'hashAlg, inFile',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'UnlockUserPassEx',
          inParams: 'sDeviceSN, sAdminPin, sNewUserPass',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'DeleteOldContainer',
          inParams: 'sDeviceSN',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'WriteFileEx',
          inParams: 'sDeviceSN, sFileName, sContent',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'ReadFileEx',
          inParams: 'sDeviceSN, sFileName',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'WriteFileBase64',
          inParams: 'sDeviceSN, sFileName, sContent',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'DeleteFile',
          inParams: 'sDeviceSN, sFileName',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_EncryptDataEx',
          inParams: 'Cert, InData',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'Base64EncodeFile',
          inParams: 'sInFile',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_GetRetryCount',
          inParams: 'CertID',
          outParamType: 'number',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_GetAllContainerName',
          inParams: 'sDeviceSN',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'CreateSoftDevice',
          inParams: 'sDeviceSN, sLabel',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'DeleteSoftDevice',
          inParams: 'sDeviceSN, sPasswd',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'EnableSoftDevice',
          inParams: 'enable, sDeviceSN',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SoftDeviceBackup',
          inParams: 'sDeviceSN, sPasswd',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SoftDeviceRestore',
          inParams: 'sDeviceSN, sPasswd, sInFilePath',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_Logout',
          inParams: 'CertID',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'Logout'
        },
        {
          funcName: 'SetUserConfig',
          inParams: 'type, strConfig',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SignByteData',
          inParams: 'CertID, byteLen',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_VerifySignedByteData',
          inParams: 'Cert, byteLen, SignValue',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'OTP_GetChallengeCode',
          inParams: 'sCertID',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'ImportEncCertEx',
          inParams: 'sDeviceSN, sContainerName, sCert, sPriKeyCipher, ulSymAlg',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_GetCertEntity',
          inParams: 'sCert',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'GetCertEntity'
        },
        {
          funcName: 'SOF_HMAC',
          inParams: 'hashid, key, indata',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SignDataByPriKey',
          inParams: 'sPriKey, sCert, sInData',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'ImportKeyCertToSoftDevice',
          inParams: 'sDeviceSN, sContainerName, sPriKey, sCert, bSign',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'InitDeviceEx',
          inParams:
            'sDeviceSN, sAdminPass, sUserPin, sKeyLabel, adminPinMaxRetry, userPinMaxRetry',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SelectFile',
          inParams: '',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SignHashData',
          inParams: 'CertID, b64ashData, hashAlg',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'SignHashData'
        },
        {
          funcName: 'SOF_VerifySignedHashData',
          inParams: 'Cert, b64ashData, SignValue, hashAlg',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid,
          aliasName: 'VerifySignedHashData'
        },
        {
          funcName: 'CheckSoftDeviceEnv',
          inParams: '',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'ImportPfxToDevice',
          inParams: 'sDeviceSN, sContainerName, bSign, strPfx, strPfxPass',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_HashDataEx',
          inParams: 'hashAlg, sInData, sCert, sID',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_HashFileEx',
          inParams: 'hashAlg, inFile, sCert, sID',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'GetDeviceCountEx',
          inParams: 'type',
          outParamType: 'number',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'GetAllDeviceSNEx',
          inParams: 'type',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_UpdateCert',
          inParams: 'CertID, type',
          outParamType: 'number',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'OpenSpecifiedFolder',
          inParams: 'backupFilePath',
          outParamType: '',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'OTP_GetChallengeCodeEx',
          inParams: 'sCertID, szAccount, money',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'Base64DecodeFile',
          inParams: 'sInData, sFilePath',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'EnumFilesInDevice',
          inParams: 'sDeviceSN',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'OTP_Halt',
          inParams: 'sCertID',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_TSGenREQ',
          inParams:
            'b64Hash, hashAlg, bReqCert, policyID, b64Nonce, b64Extension',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_TSCompareNonce',
          inParams: 'b64TSReq, b64TSAResp',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_TSGenPDFSignature',
          inParams: 'b64TSAResp, b64OriPDFSignature',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_TSVerifyPDFSignature',
          inParams: 'b64TSPDFSignature',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_TSGetPDFSignatureInfo',
          inParams: 'b64TSPDFSignature, iType',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'OTP_GetState',
          inParams: 'sCertID, bCert',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'OTP_GetSyncCode',
          inParams: 'sCertID, ChallengeCode',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_IsLogin',
          inParams: 'CertID',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_LoginEx',
          inParams: 'CertID, PassWd, updateFlag',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'EnumSupportDeviceList',
          inParams: '',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'ExportPfxFromDevice',
          inParams: 'sDeviceSN, sContainerName, bSign, strPfxPass',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SignHashMessage',
          inParams: 'CertID, InHashData, hashAlg',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'ExportPfxToFile',
          inParams: 'sDeviceSN, sContainerName, bSign, strPfxPass',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SignAPK',
          inParams: 'CertID, strOriSignature',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'YZT_GenerateKeyPair',
          inParams: 'sDeviceSN, sContainerName, iKeyTypeRSA, iKeyTypeSM2',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'YZT_ExportPubKey',
          inParams: 'sDeviceSN, sContainerName, bSign',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'YZT_ImportSignCert',
          inParams: 'sDeviceSN, sContainerName, sRSACert, sSM2Cert',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'YZT_ImportEncCert',
          inParams:
            'sDeviceSN, sContainerName, sRSACert, sRSAPriKeyCipher, ulRSASymAlg, sSM2Cert, sSM2PriKeyCipher, ulSM2SymAlg',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_ListenUKey',
          inParams: 'Parm',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_EnableLoginWindow',
          inParams: 'Parm',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SignEnvelope',
          inParams: 'CertID, Cert, InData',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_UnSignEnvelope',
          inParams: 'CertID, InData',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'BIO_MAKExportPKCS10',
          inParams: 'sDeviceSN, iKeyType, sDN',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'BIO_MAKImportSignEncCert',
          inParams: 'sDeviceSN, sSignCert, sEncCert, sPriKeyCipher',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'BIO_IssueDAKCert',
          inParams: 'sDeviceSN, iKeyType, sDN',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'BIO_InfoCollect',
          inParams: '',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'BIO_GetBioInfo',
          inParams: 'sDeviceSN',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_GetLastLoginCertID',
          inParams: '',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_ReadESealData',
          inParams: 'CertID, ulKeyIndex, ulKeyAlgId, ulFlags',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_ReadKFXESealData',
          inParams: 'CertID, ulKeyIndex, ulKeyAlgId, ulFlags',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SymDecryptFileToData',
          inParams: 'sKey, inFile',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SignMessageBase64',
          inParams: 'dwFlag, CertID, InData',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_VerifySignedMessageBase64',
          inParams: 'MessageData, InData',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_VerifySignedHashMessage',
          inParams: 'MessageData, InHashData',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SignDataBase64',
          inParams: 'CertID, InData',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_VerifySignedDataBase64',
          inParams: 'Cert, InData, SignValue',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_HashDataExBase64',
          inParams: 'hashAlg, sInData, sCert, sID',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_GetProductVersion',
          inParams: '',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_UpdateCertEx',
          inParams: 'CertID, PassWd',
          outParamType: 'number',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_GetLastSignDataCertID',
          inParams: 'CertID',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'BIO_SetUserConfig',
          inParams: 'CertID, type, strConfig',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'BIO_InvokeCommand',
          inParams: 'CertID, bstrCommand',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_ImportSymmKey',
          inParams: 'CertID, ulKeyIndex, InData, ulFlags',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_WriteESealData',
          inParams: 'CertID, InData, ulFlags',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_EPS_Encrypt',
          inParams:
            'CertID, ulKeyIndex, ulKeyAlgId, IVData, DivCount, DivComponent, InData, ulFlags',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_EPS_Decrypt',
          inParams:
            'CertID, ulKeyIndex, ulKeyAlgId, IVData, DivCount, DivComponent, InData, ulFlags',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_EPS_Mac',
          inParams:
            'CertID, ulKeyIndex, ulKeyAlgId, IVData, DivCount, DivComponent, InData, ulFlags',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_PriKeyDecryptEx',
          inParams: 'CertID, InData',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_EPS_ReadESealData',
          inParams: 'CertID, ulKeyIndex, ulKeyAlgId, ulFlags',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_EPS_WriteESealData',
          inParams: 'CertID, InData, ulFlags',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'EnumESeal',
          inParams: 'sDeviceSN',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'GetPicture',
          inParams: 'bstrConName',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SignEnvelopeFile',
          inParams: 'CertID, Cert, InFile, OutFile',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_UnSignEnvelopeFile',
          inParams: 'CertID, InFile, OutFile',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOFX_EncryptFile',
          inParams: 'CertID, Cert, InFile, OutFile, ulFlags',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOFX_DecryptFile',
          inParams: 'CertID, InFile, OutFile, ulFlags',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'GetPic',
          inParams: 'bstrConName',
          outParamType: 'string',
          clsid: xtxsync.getpic_clsid
        },
        {
          funcName: 'Hash',
          inParams: 'inData',
          outParamType: 'string',
          clsid: xtxsync.getpic_clsid
        },
        {
          funcName: 'ConvertPicFormat',
          inParams: 'inData, type',
          outParamType: 'string',
          clsid: xtxsync.getpic_clsid
        },
        {
          funcName: 'ConvertGif2Jpg',
          inParams: 'inData',
          outParamType: 'string',
          clsid: xtxsync.getpic_clsid
        },
        {
          funcName: 'GetPic1',
          inParams: 'bstrConName',
          outParamType: 'string',
          clsid: xtxsync.getpic_clsid
        },
        {
          funcName: 'ConvertPicSize',
          inParams: 'bstrPic, w, h',
          outParamType: 'string',
          clsid: xtxsync.getpic_clsid
        },
        {
          funcName: 'GetEnvVersion',
          inParams: '',
          outParamType: 'string',
          clsid: xtxsync.xtx_version_clsid
        },
        {
          funcName: 'InitDeviceWithParam',
          inParams:
            'sDeviceSN, sAppName, sAdminPass, sUserPin, sKeyLabel, adminPinMaxRetry, userPinMaxRetry, createFileRights',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SignDataEx',
          inParams: 'CertID, InData,signFlag',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_VerifySignedDataEx',
          inParams: 'Cert, InData, SignValue,signFlag',
          outParamType: 'bool',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SymEncryptDataEx',
          inParams: 'sKey,sIV,indata',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        },
        {
          funcName: 'SOF_SymDecryptDataEx',
          inParams: 'sKey,sIV,indata',
          outParamType: 'string',
          clsid: xtxsync.xtx_clsid
        }
      ]

      for (var i = 0; i < export_functions.length; i++) {
        getImplmentFunction(export_functions[i])
        xtxsync[export_functions[i].funcName] =
          window[export_functions[i].funcName]
        if (export_functions[i].aliasName) {
          window[export_functions[i].aliasName] =
            window[export_functions[i].funcName]
          xtxsync[export_functions[i].aliasName] =
            window[export_functions[i].funcName]
        }
      }

      return true
    }

    return initXTXAppObject(xtxsync)
  })()

///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// EXPORT VAR AND FUNCTIONS ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// const var
var CERT_TYPE_HARD = 1
var CERT_TYPE_SOFT = 2
var CERT_TYPE_ALL = 3

// set auto logout parameters
function SetAutoLogoutParameter (strCertID, logoutFunc) {
  xtxsync.custom.setAutoLogoutParameter(strCertID, logoutFunc)
}

// set user cert list id
function SetUserCertList (strListID, certType) {
  xtxsync.custom.setUserCertList(strListID, certType)
}

// set custom usbkeychange callback
function SetOnUsbKeyChangeCallBack (callback) {
  xtxsync.custom.setOnUsbKeyChangeCallBack(callback)
}

// set custom alert function
function SetAlertFunction (custom_alert) {
  xtxsync.custom.setErrorReportFunc(custom_alert)
}

// get custom userlogin token
function GetLoginToken () {
  return xtxsync.custom.getToken()
}

function SetLoginToken (tokenData) {
  return xtxsync.custom.setToken(tokenData)
}

function GetUserListByType (strType) {
  // strType is 'HARD' or 'SOFT'
  var strUserList = xtxsync.SOF_GetUserList()
  var strReturn = ''
  while (true) {
    var i = strUserList.indexOf('&&&')
    if (i <= 0) {
      break
    }
    var strOneUser = strUserList.substring(0, i)
    var strName = strOneUser.substring(0, strOneUser.indexOf('||'))
    var strCertID = strOneUser.substring(
      strOneUser.indexOf('||') + 2,
      strOneUser.length
    )
    var devType = xtxsync.GetDeviceInfo(strCertID, 7)
    if (devType == strType) {
      strReturn += strName + '||' + strCertID + '&&&'
    }
    var len = strUserList.length
    strUserList = strUserList.substring(i + 3, len)
  }

  return strReturn
}

//get usbKey user list
function GetUserList_USBKey (cb, ctx) {
  return GetUserListByType('HARD', cb, ctx)
}

//get soft user list
function GetUserList_Soft () {
  return GetUserListByType('SOFT', cb, ctx)
}

//sign data with pkcs7 format
function SignByP7 (strCertID, strInData, bDetach) {
  return xtxsync.SOF_SignMessage(bDetach ? 1 : 0, strCertID, strInData)
}

//get symmitric key length
//because xtx and secxv2 secx default symmitric alg is no equal
function GetSymKeyLength () {
  return 24
}

//get device type return SOFT or HARD
function GetDeviceType (strCertID) {
  return xtxsync.GetDeviceInfo(strCertID, 7)
}

// calculate file's hash
function HashFile (strFilePath) {
  return xtxsync.SOF_HashFile(2 /*sha1*/, strFilePath)
}

function ParseDateString (strDate) {
  var strYear = strDate.substring(0, 4)
  var strMonth = strDate.substring(4, 6)
  var strDay = strDate.substring(6, 8)
  var strHour = strDate.substring(8, 10)
  var strMin = strDate.substring(10, 12)
  var strSecond = strDate.substring(12, 14)
  var RtnDate = new Date()
  RtnDate.setFullYear(Number(strYear), Number(strMonth) - 1, Number(strDay))
  RtnDate.setHours(Number(strHour))
  RtnDate.setMinutes(Number(strMin))
  RtnDate.setSeconds(Number(strSecond))
  return RtnDate
}

//Form login
function Login (formName, strCertID, strPin) {
  var objForm = eval(formName)
  if (objForm == null) {
    return false
  }
  if (strCertID == null || strCertID == '') {
    xtxsync.custom.errorReportFunc('请输入证书密码！')
    return false
  }
  if (strPin == null || strPin == '') {
    xtxsync.custom.errorReportFunc('请输入证书密码！')
    return false
  }

  //Add a hidden item ...
  if (objForm.UserSignedData == null) {
    objForm.insertAdjacentHTML(
      'BeforeEnd',
      '<input type="hidden" name="UserSignedData" value="">'
    )
  }
  if (objForm.UserCert == null) {
    objForm.insertAdjacentHTML(
      'BeforeEnd',
      '<input type="hidden" name="UserCert" value="">'
    )
  }
  if (objForm.CertID == null) {
    objForm.insertAdjacentHTML(
      'BeforeEnd',
      '<input type="hidden" name="CertID" value="">'
    )
  }
  if (objForm.ContainerName == null) {
    objForm.insertAdjacentHTML(
      'BeforeEnd',
      '<input type="hidden" name="ContainerName" value="">'
    )
  }
  if (objForm.LoginToken == null) {
    objForm.insertAdjacentHTML(
      'BeforeEnd',
      '<input type="hidden" name="LoginToken" value="">'
    )
  }

  var bRet = xtxsync.SOF_Login(strCertID, strPin)
  if (!bRet) {
    var retryCount = xtxsync.SOF_GetPinRetryCount(strCertID)
    if (retryCount > 0) {
      xtxsync.custom.errorReportFunc(
        '校验证书密码失败!您还有' + retryCount + '次机会重试!'
      )
    } else if (retryCount == 0) {
      xtxsync.custom.errorReportFunc('您的证书密码已被锁死,请联系BJCA进行解锁!')
    } else {
      xtxsync.custom.errorReportFunc('登录失败!')
    }
    return false
  }

  var strClientCert = xtxsync.SOF_ExportUserCert(strCertID)
  if (strClientCert == '') {
    xtxsync.custom.errorReportFunc('导出用户证书失败!')
    return false
  }

  var strNotBefore = xtxsync.SOF_GetCertInfo(strClientCert, 11)
  var strNotAfter = xtxsync.SOF_GetCertInfo(strClientCert, 12)
  var notBeforeDate = ParseDateString(strNotBefore)
  var days = parseInt(
    (notBeforeDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )
  if (days > 0) {
    xtxsync.custom.errorReportFunc(
      '您的证书尚未生效!距离生效日期还剩' + days + '天!'
    )
    return false
  }

  var notAfterDate = ParseDateString(strNotAfter)
  var milliseconds = notAfterDate.getTime() - new Date().getTime()
  if (milliseconds < 0) {
    xtxsync.custom.errorReportFunc(
      '您的证书已过期，请尽快到北京数字证书认证中心办理证书更新手续！'
    )
    return false
  }

  days = parseInt(milliseconds / (1000 * 60 * 60 * 24))
  if (days > 0 && days <= 60) {
    xtxsync.custom.errorReportFunc(
      '您的证书还有' +
      days +
      '天过期\n请您尽快到北京数字证书认证中心办理证书更新手续！'
    )
  } else if (days == 0) {
    // 证书有效期天数小于1天
    var hours = parseInt(milliseconds / (1000 * 60 * 60))
    if (hours > 0) {
      xtxsync.custom.errorReportFunc(
        '您的证书还有' +
        hours +
        '小时过期\n请您尽快到北京数字证书认证中心办理证书更新手续！'
      )
    }
    // 证书有效期小于1小时
    var minutes = parseInt(milliseconds / (1000 * 60))
    if (minutes > 1) {
      xtxsync.custom.errorReportFunc(
        '您的证书还有' +
        minutes +
        '分钟过期\n请您尽快到北京数字证书认证中心办理证书更新手续！'
      )
    } else {
      xtxsync.custom.errorReportFunc(
        '您的证书已过期，请尽快到北京数字证书认证中心办理证书更新手续！'
      )
      return false
    }
  }

  bRet = xtxsync.SOF_VerifySignedData(
    strServerCert,
    strServerRan,
    strServerSignedData
  )
  if (!bRet) {
    xtxsync.custom.errorReportFunc('验证服务器端信息失败!')
    return false
  }

  var clientSignData = xtxsync.SOF_SignData(strCertID, strServerRan)
  if (clientSignData == '') {
    xtxsync.custom.errorReportFunc('客户端签名失败!')
    return false
  }

  objForm.CertID.value = strCertID
  objForm.ContainerName.value = strCertID
  objForm.UserCert.value = strClientCert
  objForm.UserSignedData.value = clientSignData
  objForm.LoginToken.value = xtxsync.custom.getToken()

  return true
}

export default xtxsync
