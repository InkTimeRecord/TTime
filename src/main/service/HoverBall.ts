import { uIOhook, UiohookKey, UiohookMouseEvent, UiohookWheelEvent } from 'uiohook-napi'
import log from './../utils/log'
import { GlobalShortcutEvent } from './GlobalShortcutEvent'
import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { SystemTypeEnum } from '../enums/SystemTypeEnum'
import path from 'path'
import { is } from '@electron-toolkit/utils'
import GlobalWin from './GlobalWin'
import { YesNoEnum } from '../../common/enums/YesNoEnum'
import { isNotNull } from '../../common/utils/validate'
import { spawn } from 'child_process'

// 窗口加载完毕后执行
app.whenReady().then(() => {
  // 预加载文字识别窗口
  createHoverBallWin()
  // 隐藏窗口
  hoverBallWinHide()
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
    alwaysOnTop: true,
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

let mousedownInfo: UiohookMouseEvent

let selectTextStatus

/**
 * 鼠标单击按下事件
 */
uIOhook.on('mousedown', async (e: UiohookMouseEvent) => {
  // 鼠标左键单机
  if (e.button === 1) {
    selectTextStatus = await isMouseSelectTextStatus()
    mousedownInfo = e
    setTimeout(async () => {
      // 定时任务再检测一遍，防止有时执行过快，获取到的状态不对
      // 例如划词百度或Google搜索结果的标题或链接地址时会出现
      selectTextStatus = await isMouseSelectTextStatus()
    }, 100)
  }
})

/**
 * 鼠标单击放开事件
 */
uIOhook.on('mouseup', async (e: UiohookMouseEvent) => {
  if (!selectTextStatus) {
    selectTextStatus = await isMouseSelectTextStatus()
  }
  // 鼠标左键单机
  if (e.button === 1 && selectTextStatus) {
    if (mousedownInfo.x !== e.x || mousedownInfo.y !== e.y) {
      GlobalWin.hoverBallWin.webContents
        .executeJavaScript('localStorage.hoverBallStatus')
        .then((val) => {
          if (YesNoEnum.Y === val) {
            hoverBallWinShow()
            return
          }
        })
    }
  }
})

let oneClick
let oneClickIsMouseSelectTextStatus

uIOhook.on('click', async (e: UiohookMouseEvent) => {
  if (e.clicks === 1 && e.button === 1) {
    oneClick = e
    oneClickIsMouseSelectTextStatus = await isMouseSelectTextStatus()
  }
  if (e.clicks === 2 && e.button === 1) {
    // 部分应用/页面当鼠标双击事件时
    // 鼠标第一击光标状态会变成文字选中模式
    // 鼠标第二击时光标会变回正常模式
    // 这种也属于正常状态 最终也可以选中内容
    // 所以在第一击时就需要先存储鼠标模式状态 在第二击时进行判断
    if (!oneClickIsMouseSelectTextStatus) {
      return
    }
    // 计算第一击和第二击时的X轴和Y轴的位移量 判断鼠标是否移动
    if (Math.abs(oneClick.x - e.x) > 5 || Math.abs(oneClick.y - e.y) > 5) {
      return
    }
    GlobalWin.hoverBallWin.webContents
      .executeJavaScript('localStorage.hoverBallStatus')
      .then((val) => {
        if (YesNoEnum.Y === val) {
          // log.info(e, '触发了双击')
          // log.info('触发了双击')
          hoverBallWinShow()
          return
        }
      })
  }
  if (GlobalWin.isHoverBall) {
    const position = GlobalWin.hoverBallWin.getPosition()
    const winX = position[0]
    const winY = position[1]
    const { x, y } = screen.getCursorScreenPoint()
    const statusX = winX - x
    const statusY = winY - y
    if (statusX > 30 || statusY > 30 || statusX < -30 || statusY < -30) {
      // log.info('触发了单击隐藏窗口')
      // 隐藏窗口
      hoverBallWinHide()
    }
  }
})

/**
 * 滚动鼠标时关闭悬浮球
 */
uIOhook.on('wheel', (_e: UiohookWheelEvent) => {
  if (GlobalWin.isHoverBall) {
    // log.info('触发了滚动隐藏窗口')
    hoverBallWinHide()
  }
})

/**
 * 悬浮球取词
 */
ipcMain.handle('hover-ball-events', (_event, _) => {
  log.info('[悬浮球取词] - 开始')
  hoverBallWinHide()
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

let hoverBallWinHideTask

/**
 * 悬浮球窗口显示
 */
const hoverBallWinShow = (): void => {
  if (isNotNull(hoverBallWinHideTask)) {
    clearTimeout(hoverBallWinHideTask)
  }
  GlobalWin.hoverBallWinShow()
  // 3秒后自动关闭悬浮球
  hoverBallWinHideTask = setTimeout(() => {
    hoverBallWinHide()
  }, 3000)
}

/**
 * 悬浮球窗口隐藏
 */
const hoverBallWinHide = (): void => {
  if (isNotNull(hoverBallWinHideTask)) {
    clearTimeout(hoverBallWinHideTask)
    hoverBallWinHideTask = null
  }
  GlobalWin.hoverBallWinHide()
}

/**
 * 鼠标指针是否选中文本状态
 */
const isMouseSelectTextStatus = async (): Promise<boolean> => {
  let response = false
  // 悬浮球增强模式
  await GlobalWin.hoverBallWin.webContents
    .executeJavaScript('localStorage.hoverBallEnhanceStatus')
    .then((val) => {
      response = YesNoEnum.Y === val
    })
  if (!SystemTypeEnum.isWin() || !response) {
    // 如果不为Win环境下这块默认不进行获取状态 直接返回取词
    return true
  }
  const promise = new Promise((resolve, reject) => {
    let mouseSelectTextStatusPath
    if (app.isPackaged) {
      mouseSelectTextStatusPath = path.join(
        __dirname,
        '../../../app.asar.unpacked/plugins/mouse-select-text-status.exe'
      )
    } else {
      mouseSelectTextStatusPath = path.join(__dirname, '../../plugins/mouse-select-text-status.exe')
    }
    const selectStatusSpawn = spawn(mouseSelectTextStatusPath)
    // 执行成功回调
    selectStatusSpawn.stdout.on('data', (data) => {
      resolve(data.toString())
    })
    // 执行失败回调
    selectStatusSpawn.stderr.on('data', (data) => {
      reject(data)
    })
  })
  //
  await promise
    .then((status) => {
      response = status === '1'
    })
    .catch((error) => {
      log.error('获取鼠标指针是否选中文本状态异常 = ', error)
      response = false
    })
  return response
}
