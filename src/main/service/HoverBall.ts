import { uIOhook, UiohookKey, UiohookMouseEvent, UiohookWheelEvent } from 'uiohook-napi'
import log from './../utils/log'
import { GlobalShortcutEvent } from './GlobalShortcutEvent'
import { app, BrowserWindow, ipcMain } from 'electron'
import { SystemTypeEnum } from '../enums/SystemTypeEnum'
import path from 'path'
import { is } from '@electron-toolkit/utils'
import GlobalWin from './GlobalWin'
import { WinEvent } from './Win'
import { YesNoEnum } from '../enums/YesNoEnum'

// 窗口加载完毕后执行
app.whenReady().then(() => {
  // 预加载文字识别窗口
  createHoverBallWin()
  // 隐藏窗口
  GlobalWin.hoverBallWinHide()
})

function createHoverBallWin(): void {
  const hoverBallWin = new BrowserWindow({
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
      preload: path.join(__dirname, '../preload/hoverBall.js'),
      sandbox: false,
      // 关闭检测同源策略
      webSecurity: false
    }
  })
  // 禁用按下F11全屏事件
  hoverBallWin.setFullScreenable(false)

  // 打开开发者工具
  // hoverBallWin.webContents.openDevTools({ mode: 'detach' })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    hoverBallWin.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/hoverBall.html`)
  } else {
    hoverBallWin.loadFile(path.join(__dirname, '../renderer/hoverBall.html'))
  }

  GlobalWin.setHoverBallWin(hoverBallWin)
}

uIOhook.start()

uIOhook.on('click', (e: UiohookMouseEvent) => {
  if (e.clicks === 2 && e.button === 1) {
    GlobalWin.hoverBallWin.webContents
      .executeJavaScript('localStorage.hoverBallStatus')
      .then((val) => {
        if (YesNoEnum.Y === val) {
          // log.info(e, '触发了双击')
          // log.info('触发了双击')
          GlobalWin.hoverBallWinShow(e)
          return
        }
      })
  }
  if (WinEvent.isHoverBall) {
    const position = GlobalWin.hoverBallWin.getPosition()
    const winX = position[0]
    const winY = position[1]
    // log.info('position x = ', winX, ' y = ', winY)
    // log.info('e x = ', e.x, ' y = ', e.y)
    const statusX = winX - e.x
    const statusY = winY - e.y
    if (statusX > 30 || statusY > 30 || statusX < -30 || statusY < -30) {
      // log.info('触发了单击隐藏窗口')
      // 隐藏窗口
      GlobalWin.hoverBallWinHide()
    }
  }
})

/**
 * 滚动鼠标时关闭悬浮球
 */
uIOhook.on('wheel', (_e: UiohookWheelEvent) => {
  if (WinEvent.isHoverBall) {
    // log.info('触发了滚动隐藏窗口')
    GlobalWin.hoverBallWinHide()
  }
})

/**
 * 悬浮球取词
 */
ipcMain.handle('hover-ball-events', (_event, _) => {
  log.info('[悬浮球取词] - 开始')
  GlobalWin.hoverBallWinHide()
  // 先释放按键
  uIOhook.keyToggle(UiohookKey.Ctrl, 'up')
  uIOhook.keyToggle(UiohookKey.CtrlRight, 'up')
  uIOhook.keyToggle(UiohookKey.Alt, 'up')
  uIOhook.keyToggle(UiohookKey.AltRight, 'up')
  uIOhook.keyToggle(UiohookKey.Shift, 'up')
  uIOhook.keyToggle(UiohookKey.ShiftRight, 'up')
  uIOhook.keyToggle(UiohookKey.Space, 'up')
  uIOhook.keyToggle(UiohookKey.Meta, 'up')
  uIOhook.keyToggle(UiohookKey.MetaRight, 'up')
  uIOhook.keyToggle(UiohookKey.Tab, 'up')
  uIOhook.keyToggle(UiohookKey.Escape, 'up')
  uIOhook.keyToggle(UiohookKey.CapsLock, 'up')
  GlobalShortcutEvent.isChoice = true
  GlobalShortcutEvent.getSelectedText().then((selectedText) => {
    GlobalShortcutEvent.isChoice = false
    selectedText = GlobalShortcutEvent.splitSingleCamelCase(selectedText)
    selectedText = GlobalShortcutEvent.splitSingleUnderScore(selectedText)
    // 推送给Vue页面进行更新翻译输入内容
    GlobalWin.mainWinUpdateTranslatedContent(selectedText)
    GlobalWin.mainWinShow()
  })
})
