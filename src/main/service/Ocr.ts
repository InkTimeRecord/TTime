import { app, BrowserWindow } from 'electron'
import path from 'path'
import { is } from '@electron-toolkit/utils'
import GlobalWin from './GlobalWin'

// 窗口加载完毕后执行
app.whenReady().then(() => {
  // 预加载文字识别窗口
  createOcrWin()
})

function createOcrWin(): void {
  const createOcrWin = new BrowserWindow({
    width: 810,
    height: 430,
    minWidth: 810,
    minHeight: 430,
    // 跳过任务栏显示
    skipTaskbar: true,
    // 关闭阴影效果 否则设置了窗口透明清空下 透明处会显示阴影效果
    hasShadow: false,
    // 设置窗口透明
    transparent: true,
    // 设置窗口透明色
    backgroundColor: '#0000',
    // 去除窗口边框
    frame: false,
    // 可调整大小
    resizable: true,
    // 默认不显示
    show: false,
    // 自动隐藏菜单栏
    autoHideMenuBar: true,
    ...('linux' === process.platform
      ? { icon: path.join(__dirname, '../../public/icon-1024x1024.png') }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/ocr.js'),
      sandbox: false,
      // 关闭检测同源策略
      webSecurity: false
    }
  })
  // 禁用按下F11全屏事件
  createOcrWin.setFullScreenable(false)
  createOcrWin.webContents.openDevTools({ mode: 'detach' })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    createOcrWin.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/ocr.html`)
  } else {
    createOcrWin.loadFile(path.join(__dirname, '../renderer/ocr.html'))
  }
  GlobalWin.setOcrWin(createOcrWin)

  /**
   * 窗口关闭事件
   */
  GlobalWin.ocrWin.on('close', (event) => {
    if (!GlobalWin.isOcrWinClose && !is.dev) {
      // 阻止窗口关闭
      event.preventDefault()
      // 隐藏窗口
      GlobalWin.ocrWinHide()
    }
  })

  /**
   * 窗口失去焦点事件
   */
  GlobalWin.ocrWin.on('blur', () => {
    if (GlobalWin.isOcrAlwaysOnTop) {
      return
    }
    // 隐藏窗口
    GlobalWin.ocrWinHide()
  })

  /**
   * 调整窗口大小时触发
   *
   * @param newBounds 新位置的坐标、宽高信息
   */
  GlobalWin.ocrWin.on('will-resize', (_event, newBounds) => {
    GlobalWin.ocrWin.webContents.send('win-size-update', newBounds)
  })
}
