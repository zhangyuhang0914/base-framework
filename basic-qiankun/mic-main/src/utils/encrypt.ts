// @ts-nocheck
import CryptoJS from 'crypto-js'

const __encode = 'jsjiami.com'

const _a: Record<string, string> = {}

const __Oxa467a: string[] = [
  '\x33\x33\x33\x33\x73\x63\x73\x63\x34\x34\x34\x34\x6A\x74\x6A\x74',
  '\x70\x61\x72\x73\x65',
  '\x55\x74\x66\x38',
  '\x65\x6E\x63',
  '\x45\x43\x42',
  '\x6D\x6F\x64\x65',
  '\x50\x6B\x63\x73\x37',
  '\x70\x61\x64',
  '\x65\x6E\x63\x72\x79\x70\x74',
  '\x41\x45\x53',
  '\x2F',
  '\x67',
  '\x23',
  '\x72\x65\x70\x6C\x61\x63\x65',
  '\x75\x6E\x64\x65\x66\x69\x6E\x65\x64',
  '\x6C\x6F\x67',
  '\u5220\u9664',
  '\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A',
  '\u671F\u5F39\u7A97\uFF0C',
  '\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C',
  '\x6A\x73\x6A\x69\x61',
  '\x6D\x69\x2E\x63\x6F\x6D'
]

function myEncrypt(_0xf87fx2: string): string {
  const _0xf87fx3 = CryptoJS[__Oxa467a[0x3]][__Oxa467a[0x2]][__Oxa467a[0x1]](
    __Oxa467a[0x0]
  )
  const _0xf87fx4 =
    CryptoJS[__Oxa467a[0x3]][__Oxa467a[0x2]][__Oxa467a[0x1]](_0xf87fx2)
  const _0xf87fx5 = CryptoJS[__Oxa467a[0x9]][__Oxa467a[0x8]](
    _0xf87fx4,
    _0xf87fx3,
    {
      mode: CryptoJS[__Oxa467a[0x5]][__Oxa467a[0x4]],
      padding: CryptoJS[__Oxa467a[0x7]][__Oxa467a[0x6]]
    }
  )
  const _0xf87fx6 = new RegExp(__Oxa467a[0xa], __Oxa467a[0xb])
  return _0xf87fx5.toString()[__Oxa467a[0xd]](_0xf87fx6, __Oxa467a[0xc])
}

;(function (_0xf87fx7, _0xf87fx8, _0xf87fx9, _0xf87fxa, _0xf87fxb, _0xf87fxc) {
  _0xf87fxc = __Oxa467a[0xe]
  _0xf87fxa = function (_0xf87fxd) {
    if (typeof alert !== _0xf87fxc) {
      alert(_0xf87fxd)
    }
    if (typeof console !== _0xf87fxc) {
      console[__Oxa467a[0xf]](_0xf87fxd)
    }
  }
  _0xf87fx9 = function (_0xf87fxe, _0xf87fx7) {
    return _0xf87fxe + _0xf87fx7
  }
  _0xf87fxb = _0xf87fx9(
    __Oxa467a[0x10],
    _0xf87fx9(_0xf87fx9(__Oxa467a[0x11], __Oxa467a[0x12]), __Oxa467a[0x13])
  )
  try {
    _0xf87fx7 = __encode
    if (
      !(
        typeof _0xf87fx7 !== _0xf87fxc &&
        _0xf87fx7 === _0xf87fx9(__Oxa467a[0x14], __Oxa467a[0x15])
      )
    ) {
      _0xf87fxa(_0xf87fxb)
    }
  } catch (e) {
    _0xf87fxa(_0xf87fxb)
  }
})()
export default myEncrypt
