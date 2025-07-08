/*
 * @Author       : 超人
 * @Description  : 授人以渔，功德无量，利在千秋
 * @Date         : 2025-07-08 10:33:55
 * @LastEditTime : 2025-07-08 16:05:39
 */

import type { LanguageKey } from '@/language/interface'

/* GlobalState */
export interface GlobalState {
  language: LanguageKey
}

/* UserState */
export interface UserState {
  token: string
}
