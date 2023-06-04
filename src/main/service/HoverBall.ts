import { uIOhook, UiohookMouseEvent } from 'uiohook-napi'
import log from './../utils/log'
import { GlobalShortcutEvent } from './GlobalShortcutEvent'
import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { SystemTypeEnum } from '../enums/SystemTypeEnum'
import path from 'path'
import { is } from '@electron-toolkit/utils'

// 窗口加载完毕后执行
app.whenReady().then(() => {
  // 预加载文字识别窗口
  createHoverBallWin()
})

if (!SystemTypeEnum.isMac()) {
  // 禁用硬件加速
  app.disableHardwareAcceleration()
}

function createHoverBallWin(): void {
  const hoverBallWin = new BrowserWindow({
    width: 25,
    height: 25,
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
    // 默认不显示
    show: true,
    // 自动隐藏菜单栏
    autoHideMenuBar: true,
    type: SystemTypeEnum.isMac() ? 'panel' : 'toolbar',
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/hoverBall.js'),
      // sandbox: false,
      // 关闭检测同源策略
      // webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      spellcheck: true
    }
  })
  // 禁用按下F11全屏事件
  hoverBallWin.setFullScreenable(false)

  // 打开开发者工具
  hoverBallWin.webContents.openDevTools({ mode: 'detach' })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    hoverBallWin.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/hoverBall.html`)
  } else {
    hoverBallWin.loadFile(path.join(__dirname, '../renderer/hoverBall.html'))
  }

  const setTop = () => {
    hoverBallWin == null
      ? void 0
      : hoverBallWin.setAlwaysOnTop(
          true,
          SystemTypeEnum.isMac() ? 'floating' : 'screen-saver',
          SystemTypeEnum.isMac() ? 1 : 99999999
        )
  }
  const showInput = false
  setTop()
  if (!SystemTypeEnum.isMac()) {
    setInterval(() => {
      if (showInput) return
      setTop()
    }, 2e3)
  }

  hoverBallWin === null
    ? void 0
    : hoverBallWin.setVisibleOnAllWorkspaces(false, {
        visibleOnFullScreen: true
      })

  let ignoreBallEventsG = true
  ipcMain.handle('set-ignore-mouse-events', (_event, ignoreBallEvents) => {
    if (ignoreBallEventsG === ignoreBallEvents) {
      return
    }
    ignoreBallEventsG = ignoreBallEvents
    console.log('触发了 = ', ignoreBallEvents)
    hoverBallWin.setIgnoreMouseEvents(ignoreBallEvents, { forward: true })
  })
}

uIOhook.start()

uIOhook.on('click', (e: UiohookMouseEvent) => {
  if (e.clicks === 2 && e.button === 1) {
    // log.info('触发了双击', e)
    // GlobalShortcutEvent.translateChoice()
  }
})
