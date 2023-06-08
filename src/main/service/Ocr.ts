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
    width: 800,
    height: 700,
    // 跳过任务栏显示
    // skipTaskbar: true,
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
    // 自动隐藏菜单栏
    // autoHideMenuBar: true,
    // focusable: false,
    // type: SystemTypeEnum.isMac() ? 'panel' : 'toolbar',
    // alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/ocr.js'),
      sandbox: false,
      // 关闭检测同源策略
      webSecurity: false
    }
  })
  // 禁用按下F11全屏事件
  createOcrWin.setFullScreenable(false)

  // 打开开发者工具
  createOcrWin.webContents.openDevTools({ mode: 'detach' })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    createOcrWin.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/ocr.html`)
  } else {
    createOcrWin.loadFile(path.join(__dirname, '../renderer/ocr.html'))
  }
  GlobalWin.setOcrWin(createOcrWin)
}
