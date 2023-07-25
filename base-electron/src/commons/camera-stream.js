import { $message } from '@/plugins/element'
import jsQR from 'jsqr'

class CameraStream {
  constructor(data) {
    // 设备信息
    this.device = {}
    this.width = data.width || '350'
    this.height = data.height || '350'
    // 设备的唯一标识符
    this.deviceKind = 'videoinput'
    this.types = data.types
    // 容器节点
    this.containerId = data.containerId
    this.videoDom = null
    // 图像节点
    this.canvasDom = null
    // 摄像头是否打开
    this.isCameraOpen = false
    // 识别二维码回调
    this.jsqrCallback = data.jsqrCallback
    // 拍照回调
    this.photoCallback = data.photoCallback
    this.initCamera()
  }

  // 初始化摄像头
  initCamera () {
    try {
      // 获取 windows 可用媒体设备信息
      navigator.mediaDevices.enumerateDevices().then(devices => {
        // console.log('devices', devices)
        // 根据设备id判断具体使用哪个摄像头
        for (const key in devices) {
          if (devices[key].kind === this.deviceKind) {
            this.device = devices[key]
            break
          }
        }
      })
    } catch (error) {
      this.errorCamera(error)
    }
  }

  // 打开摄像头
  async openCamera () {
    // 如摄像头已打开，则直接返回
    if (this.isCameraOpen) return false
    // 约束条件
    const constraints = {
      video: {
        frameRate: {
          ideal: 20
        },
        device: this.device.deviceId
      }
    }
    try {
      // 获取流视频
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      if (stream) {
        this.showStream(stream)
      } else {
        $message('未获取到摄像头')
      }
    } catch (error) {
      this.errorCamera(error)
    }
  }

  // 显示画面
  showStream (stream) {
    // 获取容器
    const container = document.getElementById(this.containerId)
    // video标签
    this.videoDom = document.createElement('video')
    // 将 video 标签添加到指定节点中
    container.appendChild(this.videoDom)
    if (!this.videoDom) return false
    this.videoDom.style.width = this.width.toString().indexOf('%') !== -1 ? this.width : this.width + 'px'
    this.videoDom.style.height = this.height.toString().indexOf('%') !== -1 ? this.height : this.height + 'px'
    this.videoDom.autoplay = true
    // 播放画面
    this.videoDom.srcObject = stream
    this.videoDom.onloadedmetadata = () => this.videoDom.play()
    // 打开摄像头
    this.isCameraOpen = true
    // canvase标签
    this.canvasDom = document.createElement('canvas')
    // 将 video canvas 标签添加到指定节点中
    document.body.appendChild(this.canvasDom)
    // 隐藏 canvas 标签
    this.canvasDom.style.display = 'none'
    // 优化浏览器多次读取
    this.canvasDom.willReadFrequently = true
    this.canvasDom.width = this.videoDom.clientWidth || '350'
    this.canvasDom.height = this.videoDom.clientHeight || '350'
    if (this.types.includes('scan')) {
      this.setupScan()
    }
    if (this.types.includes('photo')) {
      // 画面未加载完避免拍照白屏
      setTimeout(() => {
        this.setTakePhoto()
      }, 300)
    }
  }

  // 扫码
  setupScan () {
    // 创建二维上下文
    const canvasContext = this.canvasDom.getContext('2d')
    // 在视频播放后，监听每一帧的渲染
    this.videoDom.addEventListener('play', () => {
      // 获取每一帧画面并进行二维码识别
      const renderFrame = () => {
        // 防止关闭流后获取video报错
        if (!this.videoDom) return false
        canvasContext.drawImage(this.videoDom, 0, 0, this.videoDom.clientWidth, this.videoDom.clientHeight)
        // 从 Canvas 中获取图像数据
        const imageData = canvasContext.getImageData(0, 0, this.canvasDom.width, this.canvasDom.height)
        // 进行二维码识别
        const qrCodeResult = jsQR(imageData.data, imageData.width, imageData.height)
        if (qrCodeResult) {
          // 检测到二维码，可以在这里处理识别结果
          this.jsqrCallback && this.jsqrCallback(qrCodeResult.data)
          console.log('二维码内容:', qrCodeResult.data)
        }
        // 递归进行下一帧的渲染
        requestAnimationFrame(renderFrame)
      }
      // 开始识别
      renderFrame()
    })
  }

  // 拍照
  setTakePhoto () {
    this.isCameraOpen = true
    // 创建一个临时的 canvas 元素
    let tempCanvas = document.createElement('canvas')
    const tempContext = tempCanvas.getContext('2d')
    // 设置临时 canvas 的宽高和视频画面一样
    tempCanvas.width = this.canvasDom.width
    tempCanvas.height = this.canvasDom.height
    // 将视频画面绘制到临时 canvas 上
    tempContext.drawImage(this.videoDom, 0, 0, this.videoDom.clientWidth, this.videoDom.clientHeight)
    // 将临时 canvas 转换为图片数据
    const imageData = tempCanvas.toDataURL('image/png')
    // 调用回调函数，并传递图片数据
    this.photoCallback && this.photoCallback(imageData)
  }

  // 关闭摄像头
  closeCamera () {
    // 如摄像头已关闭，则直接返回
    if (!this.isCameraOpen) return false
    if (!this.videoDom || this.videoDom.srcObject === null) return false
    // 获取视频元素的媒体流对象
    const mediaStream = this.videoDom.srcObject
    if (mediaStream) {
      // 获取媒体流对象的所有轨道
      const tracks = mediaStream.getTracks()
      // 停止所有轨道
      tracks.forEach(track => track.stop())
    }
    // 销毁视频标签
    if (this.videoDom) {
      // 停止播放
      this.videoDom.pause()
      this.videoDom.srcObject = null
      // 从 DOM 中移除
      this.videoDom.parentNode.removeChild(this.videoDom)
      this.videoDom = null
    }
    // 销毁画布标签
    if (this.canvasDom) {
      // 清空画布
      const canvasContext = this.canvasDom.getContext('2d')
      canvasContext.clearRect(0, 0, this.canvasDom.width, this.canvasDom.height)
      // 从 DOM 中移除
      this.canvasDom.parentNode.removeChild(this.canvasDom)
      this.canvasDom = null
    }
    // 关闭摄像头
    this.isCameraOpen = false
  }

  // 获取摄像头失败
  errorCamera (error) {
    $message('获取摄像头流失败')
    console.log('获取摄像头流失败', error)
  }
}

export default CameraStream
