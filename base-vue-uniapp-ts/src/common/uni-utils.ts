export const loading = {
  show: (message: string = '加载中') => {
    uni.showLoading({
      title: message,
      mask: true
    })
  },
  hide: () => {
    uni.hideLoading()
  }
}

export const toast = {
  show: (message: string, type: 'none' | 'success' = 'none', duration: number = 1500) => {
    uni.showToast({
      title: message || '',
      icon: type,
      duration: duration
    })
  },
  hide: () => {
    uni.hideToast()
  }
}
