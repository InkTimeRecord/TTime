import { contextBridge, nativeImage } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const ipcRenderer = electronAPI.ipcRenderer

/**
 * 页面鼠标右键监听
 */
document.oncontextmenu = () => {
  // 关闭截图窗口事件
  ipcRenderer.invoke('close-screenshots-win-event')
}

ipcRenderer.on('win-multiple-draw-screenshot-style', async (_event, screenImgInfo) => {
  const toCanvas = (canvas, img, w, h): void => {
    canvas.width = w
    canvas.height = h
    const x = nativeImage.createFromBuffer(img).toBitmap()
    for (let i = 0; i < x.length; i += 4) {
      ;[x[i], x[i + 2]] = [x[i + 2], x[i]]
    }
    const d = new ImageData(Uint8ClampedArray.from(x), w, h)
    canvas.getContext('2d').putImageData(d, 0, 0)
  }

  for (const i of screenImgInfo) {
    i.height = i.height * i.scaleFactor
    i.width = i.width * i.scaleFactor
    if (i) {
      const c = document.createElement('canvas')
      toCanvas(c, i.image, i.width, i.height)
    }
  }
})

/**
 * 窗口绘制截图样式
 */
ipcRenderer.on('win-draw-screenshot-style', async (_event, screenImgInfo) => {
  // @ts-ignore
  // 设置显示器ID
  document.getElementById('screenId').value = screenImgInfo.screenId
  // 获取当前鼠标所在的显示器缩放比例事件
  // 在这里触发一次是因为如果当前鼠标所在的显示器就在修改过缩放比例的显示器中时
  // 可能还没有设置完 screenId ，所以会导致没有获取到
  // 所以这里手动触发一次
  ipcRenderer.invoke('screen-scale-factor-event', screenImgInfo.screenId)
  // 背景图
  const bg = document.querySelector('.bg')
  // 背景放大镜
  const bgMagnifier = document.getElementById('magnifierImg')
  // 画图框
  const rect = document.querySelector('.rect')
  // 尺寸信息
  const sizeInfo = document.querySelector('.size-info')
  // 窗口绘制截图样式
  const draw = new Draw(
    screenImgInfo.screenImgUrl,
    // @ts-ignore
    bg,
    bgMagnifier,
    screenImgInfo.width,
    screenImgInfo.height,
    rect,
    sizeInfo
  )
  // 鼠标按下事件
  document.addEventListener('mousedown', draw.startRect.bind(draw))
  // 鼠标移动事件
  document.addEventListener('mousemove', draw.drawingRect.bind(draw))
  // 鼠标释放事件
  document.addEventListener('mouseup', draw.endRect.bind(draw))
})

class SelectRectMeta {
  // canvas 最终的 left
  x: number
  // canvas 最终的 top
  y: number
  // 鼠标一开始点那个点，e.pageX
  startX: number
  // 鼠标一开始点那个点，e.pageY
  startY: number
  // 向量，宽，为负说明在 startX 的左边
  w: number
  // 向量，高，为负说明在 startY 的左边
  h: number
  // 是否可画，mousedown 为 true，mouseup 为 false
  drawing: boolean
  // 是否可拖拽
  dragging: boolean
  // 矩阵图信息
  RGBAData: ImageData | null
  // base64 编码的二进制图片数据
  base64Data: string | null

  constructor() {
    this.x = 0
    this.y = 0
    this.startX = 0
    this.startY = 0
    this.w = 0
    this.h = 0
    this.drawing = false
    this.dragging = false
    this.RGBAData = null
    this.base64Data = null
  }
}

class Draw {
  screenImgUrl: string
  screenWidth: number
  screenHeight: number
  $bgImageDOM: HTMLImageElement
  $bgMagnifierImageDOM: HTMLImageElement
  /**
   * 背景图数据存在 canvas 里面
   */
  $bgCanvasTemp: HTMLCanvasElement | null
  /**
   * 剪切下来的图
   */
  $bgCanvasTempCtx: CanvasRenderingContext2D | null
  $rectCanvasDOM: HTMLCanvasElement
  $rectCanvasCtx: CanvasRenderingContext2D | null
  $sizeInfoDom: HTMLDivElement
  selectRectMeta: SelectRectMeta
  drawing: boolean

  constructor(
    screenImgUrl: string,
    bg: HTMLImageElement,
    bgMagnifier: HTMLImageElement,
    screenWidth: number,
    screenHeight: number,
    rect,
    sizeInfo
  ) {
    this.drawing = false
    // 屏幕图像
    this.screenImgUrl = screenImgUrl
    // 屏幕图像
    this.screenWidth = screenWidth
    this.screenHeight = screenHeight
    this.$bgImageDOM = bg
    this.$bgMagnifierImageDOM = bgMagnifier
    this.$bgCanvasTemp = null
    this.$bgCanvasTempCtx = null
    // 初始化操作屏幕快照及画布
    this.initFullScreenCanvas()

    this.$rectCanvasDOM = rect
    this.$rectCanvasCtx = this.$rectCanvasDOM.getContext('2d')

    this.$sizeInfoDom = sizeInfo

    // 存储位置，矩形宽高,是否可画等meta信息
    this.selectRectMeta = new SelectRectMeta()

    // 绑定 this 到原型链上,方便使用
    this.updateMouseCoordinate = this.updateMouseCoordinate.bind(this)
    this.setSizeInfo = this.setSizeInfo.bind(this)
    this.destroy = this.destroy.bind(this)
    this.done = this.done.bind(this)
  }

  /**
   * 初始化操作
   *
   * 记录屏幕快照，并赋值给背景
   */
  async initFullScreenCanvas(): Promise<void> {
    // 设置背景图片
    this.$bgImageDOM.src = this.screenImgUrl
    // 设置放大镜背景图片
    this.$bgMagnifierImageDOM.src = this.screenImgUrl

    // 创建新的canvas上下文作为存储，方便取出里面的rgba信息
    this.$bgCanvasTemp = document.createElement('canvas')
    this.$bgCanvasTempCtx = this.$bgCanvasTemp.getContext('2d')
    // 新建一个图片，用来放进canvas存图片数据
    const img = await new Promise((resolve) => {
      const img = new Image()
      img.src = this.screenImgUrl
      if (img.complete) {
        resolve(img)
      } else {
        img.onload = (): void => resolve(img)
      }
    })
    this.$bgCanvasTemp.style.backgroundSize = `cover`
    this.$bgCanvasTemp.width = this.screenWidth
    this.$bgCanvasTemp.height = this.screenHeight
    // @ts-ignore 忽略校验
    this.$bgCanvasTempCtx.drawImage(img, 0, 0, this.screenWidth, this.screenHeight)
    // @ts-ignore 忽略校验
    this.$bgCanvasTempCtx.backgroundSize = 'cover'
  }

  // 开始按下，对应mousedown事件
  startRect(e): void {
    this.drawing = true
    // 鼠标按下的定点坐标
    this.selectRectMeta.startX = e.pageX
    this.selectRectMeta.startY = e.pageY
  }

  /**
   * 鼠标移动事件
   * 正在画矩形选区
   *
   * @param e
   */
  drawingRect(e): void {
    if (!this.drawing) {
      return
    }
    this.updateMouseCoordinate(e)
    // 宽高需赋值绝对值为正
    const selectWidth = Math.abs(this.selectRectMeta.w)
    const selectHeight = Math.abs(this.selectRectMeta.h)
    const selectX = Math.abs(this.selectRectMeta.x)
    const selectY = Math.abs(this.selectRectMeta.y)
    this.$rectCanvasDOM.width = selectWidth
    this.$rectCanvasDOM.height = selectHeight
    this.$rectCanvasDOM.style.left = `${selectX}px`
    this.$rectCanvasDOM.style.top = `${selectY}px`
    // 没有拉伸距离会报错
    if (!this.selectRectMeta.w || !this.selectRectMeta.h) {
      return
    }
    if (null === this.$bgCanvasTempCtx) {
      return
    }
    // 获取 矩形 坐标在整个 全屏 的位置，生成RGBAData传入回矩形选区
    this.selectRectMeta.RGBAData = this.$bgCanvasTempCtx.getImageData(
      selectX,
      selectY,
      Math.abs(this.selectRectMeta.w),
      Math.abs(this.selectRectMeta.h)
    )
    if (null === this.$rectCanvasCtx) {
      return
    }
    this.$rectCanvasCtx.putImageData(this.selectRectMeta.RGBAData, 0, 0)
    // 设置填充颜色
    this.$rectCanvasCtx.fillStyle = '#0091ff30'
    this.$rectCanvasCtx.fillRect(0, 0, selectWidth, selectHeight)

    // 设置线条颜色
    this.$rectCanvasCtx.strokeStyle = '#2371F8'
    this.$rectCanvasCtx.lineWidth = 1
    this.$rectCanvasCtx.strokeRect(0, 0, this.$rectCanvasDOM.width, Math.abs(this.selectRectMeta.h))
    //尺寸信息
    this.setSizeInfo()
  }

  /**
   * 更新当前鼠标画图的坐标信息
   *
   * @param e
   */
  updateMouseCoordinate(e): void {
    // 计算坐标差值（宽高）
    this.selectRectMeta.w = e.pageX - this.selectRectMeta.startX
    this.selectRectMeta.h = e.pageY - this.selectRectMeta.startY
    // 计算真正的x，y坐标，根据距离在鼠标定点的左右来判断，即大于0
    if (this.selectRectMeta.w > 0) {
      this.selectRectMeta.x = this.selectRectMeta.startX
    } else {
      this.selectRectMeta.x = e.pageX
    }
    if (this.selectRectMeta.h > 0) {
      this.selectRectMeta.y = this.selectRectMeta.startY
    } else {
      this.selectRectMeta.y = e.pageY
    }
  }

  /**
   * 鼠标释放事件
   * 画完
   */
  endRect(): void {
    // 设置为绘图结束状态
    this.drawing = false
    // 转成base64图片
    this.selectRectMeta.base64Data = this.RGBA2ImageData(this.selectRectMeta.RGBAData)
    this.done()
  }

  /**
   * 设置页面宽高信息
   * 主要用于展示
   */
  setSizeInfo(): void {
    this.$sizeInfoDom.style.display = 'block'
    this.$sizeInfoDom.style.left = `${this.selectRectMeta.x}px`
    this.$sizeInfoDom.style.top = `${this.selectRectMeta.y - 25}px`
    this.$sizeInfoDom.innerHTML = `${Math.abs(this.selectRectMeta.w)} * ${Math.abs(
      this.selectRectMeta.h
    )}`
  }

  /**
   * 退出截图
   *
   */
  destroy(): void {
    // 截图退出事件
    ipcRenderer.invoke('screenshot-end-event', '')
  }

  /**
   * 完成截图
   */
  done(): void {
    const base64Data = this.selectRectMeta.base64Data
    if (null === base64Data) {
      return
    }
    // 处理图片文字识别
    ipcRenderer.invoke(
      'handle-image-text-recognition-event',
      nativeImage.createFromDataURL(base64Data)
    )
    // 退出截图
    this.destroy()
  }

  /**
   * 矩阵图转base64格式
   *
   * 原理是插入canvas里面，通过canvas转成图片
   *
   * @param RGBAImg 矩阵图
   * @returns {string} base64图片
   * @constructor
   */
  RGBA2ImageData(RGBAImg): string {
    const width = RGBAImg.width
    const height = RGBAImg.height
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (ctx == null) {
      return ''
    }
    const imgData = ctx.createImageData(width, height)
    imgData.data.set(RGBAImg.data)
    ctx.putImageData(imgData, 0, 0)
    return canvas.toDataURL()
  }
}


/**
 * 截图结束事件
 *
 * @param callback 回调方法 用于主进程内部触发时推送到页面执行
 */
const screenshotEndEvent = (callback): void => {
  ipcRenderer.on('win-draw-screenshot-style', (_event) => {
    callback()
  })
}

/**
 * 获取当前鼠标所在的显示器缩放比例通知事件
 *
 * @param callback 回调方法 用于主进程内部触发时推送到页面执行
 */
const screenScaleFactorNoticeEvent = (callback): void => {
  ipcRenderer.on('screen-scale-factor-notice-event', (_event, scaleFactor) => {
    callback(scaleFactor)
  })
}

/**
 * 获取当前鼠标所在的显示器缩放比例事件
 *
 * @param screenId 屏幕ID
 */
const screenScaleFactorEvent = (screenId): void => {
  ipcRenderer.invoke('screen-scale-factor-event', screenId)
}

// Custom APIs for renderer
const api = {
  screenScaleFactorNoticeEvent,
  screenScaleFactorEvent,
  screenshotEndEvent
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
