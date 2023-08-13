import { uIOhook, UiohookWheelEvent } from 'uiohook-napi'
import { app, BrowserWindow, screen } from 'electron'
import { SystemTypeEnum } from '../enums/SystemTypeEnum'
import path from 'path'
import { is } from '@electron-toolkit/utils'
import GlobalWin from './GlobalWin'

// 窗口加载完毕后执行
app.whenReady().then(() => {
  // 预加载窗口
  createOcrSilenceWin()
  // 隐藏窗口
  GlobalWin.ocrSilenceWinHide()
})

function createOcrSilenceWin(): void {
  const ocrSilenceWin = new BrowserWindow({
    width: 30,
    height: 30,
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
    resizable: false,
    // 自动隐藏菜单栏
    autoHideMenuBar: true,
    focusable: false,
    type: SystemTypeEnum.isMac() ? 'panel' : 'toolbar',
    // alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/ocrSilence.js'),
      sandbox: false,
      // 关闭检测同源策略
      webSecurity: false
    }
  })
  // 禁用按下F11全屏事件
  ocrSilenceWin.setFullScreenable(false)

  // 打开开发者工具
  // ocrSilenceWin.webContents.openDevTools({ mode: 'detach' })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    ocrSilenceWin.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/ocrSilence.html`)
  } else {
    ocrSilenceWin.loadFile(path.join(__dirname, '../renderer/ocrSilence.html'))
  }

  GlobalWin.setOcrSilenceWin(ocrSilenceWin)
}

uIOhook.start()

/**
 * 滚动鼠标时关闭加载窗口
 */
uIOhook.on('wheel', (_e: UiohookWheelEvent) => {
  if (GlobalWin.isOcrSilence) {
    // log.info('触发了滚动隐藏窗口')
    GlobalWin.ocrSilenceWinHide()
  }
})

/**
 * 鼠标移动
 */
uIOhook.on('mousemove', () => {
  if (GlobalWin.isOcrSilence) {
    GlobalWin.ocrSilenceWin.webContents
      .executeJavaScript('JSON.stringify({width:screen.width,height: screen.height})')
      .then((value) => {
        const res = JSON.parse(value)
        const width = res.width
        const height = res.height
        // 获取到鼠标的横坐标和纵坐标
        const { x, y } = screen.getCursorScreenPoint()
        // 设置坐标的同时设置宽高 否则在多显示器且显示器之间缩放比例不一致的情况下来回切换会导致加载窗口显示错位
        GlobalWin.ocrSilenceWin.setBounds({ x: x, y: y + 11, width: width, height: height })
      })
  }
})
