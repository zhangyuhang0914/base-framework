import { customRef } from 'vue'

export const debounceRef = (value: any, delay = 200) => {
  let timer: any = null
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue: any) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}
