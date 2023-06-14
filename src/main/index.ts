import { app, BrowserWindow, ipcMain, shell } from 'electron'
import * as path from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { GlobalShortcutEvent } from './service/GlobalShortcutEvent'
import { WinEvent } from './service/Win'
import { TrayEvent } from './service/TrayEvent'
import log from './utils/log'
import createSetWindow from './service/Set'
import AutoUpdater from './service/AutoUpdater'
import { SystemTypeEnum } from './enums/SystemTypeEnum'
import GlobalWin from './service/GlobalWin'
import './service/TTimeEvent'
import './service/channel/TranslateChannel'
import './service/HoverBall'
import './service/Ocr'
import './service/OcrSilence'
import { isNull } from './utils/validate'
import { injectWinAgent } from './utils/RequestUtil'
import { spawn } from 'child_process'
import { EnvEnum } from './enums/EnvEnum'

// 解决使用 win.hide() 后再使用 win.show() 会引起窗口闪烁问题
app.commandLine.appendSwitch('wm-window-animations-disabled')

if (!SystemTypeEnum.isMac()) {
  // 禁用硬件加速
  app.disableHardwareAcceleration()
}

// 当前软件版本
const version = app.getVersion()

const mainWinInfo = {
  width: 450,
  height: 339
}
// 主窗口
let mainWin: BrowserWindow

// 获取单例锁
const gotTheLock = app.requestSingleInstanceLock()
if (gotTheLock) {
  // 当多开时，多个实例执行调用 app.requestSingleInstanceLock() 时
  // 这个事件将在应用程序的首个已经启动的实例中触发
  app.on('second-instance', (_event, _commandLine, _workingDirectory) => {
    if (mainWin) {
      // 显示主窗口
      GlobalShortcutEvent.translateInput()
    }
  })
} else {
  // 如果获取单例锁失败，则表明应用程序已启动了
  // 这里直接执行退出当前重复实例即可
  app.quit()
}

function createWindow(): void {
  mainWin = new BrowserWindow({
    width: mainWinInfo.width,
    height: mainWinInfo.height,
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
    show: false,
    // 自动隐藏菜单栏
    autoHideMenuBar: true,
    ...('linux' === process.platform
      ? { icon: path.join(__dirname, '../../public/icon-1024x1024.png') }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      // 关闭检测同源策略
      webSecurity: false
    }
  })
  // 禁用按下F11全屏事件
  mainWin.setFullScreenable(false)
  // mainWin.setIgnoreMouseEvents(true, { forward: true })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWin.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWin.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  mainWin.webContents
    .executeJavaScript('JSON.parse(localStorage.agentConfig)')
    .then((agentConfig) => {
      injectWinAgent(agentConfig, mainWin.webContents.session)
    })

  // mainWin.webContents.openDevTools({ mode: 'detach' })
  GlobalWin.setMainWin(mainWin)
  // 窗口事件
  new WinEvent(mainWinInfo)
  // 托盘事件
  new TrayEvent()
  // 注册全局快捷方式
  new GlobalShortcutEvent().registerAll()
  // 自动更新逻辑
  new AutoUpdater()

  /**
   * 主窗口关闭事件
   */
  mainWin.on('close', (event) => {
    if (!GlobalWin.isMainWinClose && !is.dev) {
      // 阻止窗口关闭
      event.preventDefault()
      // 隐藏窗口
      GlobalWin.mainWinHide()
    }
  })

  /**
   * 主窗口显示时触发事件
   */
  mainWin.on('show', () => {
    mainWin.webContents.send('win-show-event')
  })

  /**
   * 窗口失去焦点事件
   */
  mainWin.on('blur', () => {
    if (GlobalWin.isMainAlwaysOnTop) {
      return
    }
    // 隐藏窗口
    GlobalWin.mainWinHide()
    mainWin.webContents.send('clear-all-translated-content')
    mainWin.webContents.send('win-show-input-event')
  })

  // 监听 will-download
  mainWin.webContents.session.on('will-download', (event, item, webContents) => {
    const newVersionPath = path.join(app.getPath('userData') + '/newVersion/', item.getFilename())
    item.setSavePath(newVersionPath)
    // 计算下载进度
    const progress = item.getReceivedBytes() / item.getTotalBytes()
    log.info({
      progress: progress
    })
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
        quitAndInstallByUser(newVersionPath)
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  })
  // // 触发下载
  // mainWin.webContents.downloadURL(
  //   'https://gitcode.net/qq_37346938/TTime/-/raw/main/version/TTime-0.4.0-setup.exe'
  // )

  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  async function spawnExpand(exe, args) {
    return new Promise((resolve, reject) => {
      try {
        const process = spawn(exe, args, {
          detached: true,
          stdio: 'ignore'
        })
        process.on('error', (error) => {
          reject(error)
        })
        process.unref()

        if (process.pid !== undefined) {
          resolve(true)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * 执行安装
   */
  const execInstall = (exePath) => {
    log.info('process.resourcesPath = ', process.resourcesPath)
    // elevate.exe 主要用于解决运行权限问题
    let elevateUrl = path.join(process.resourcesPath!, 'elevate.exe')
    log.info('elevateUrl = ', elevateUrl)
    if (EnvEnum.isDev()) {
      elevateUrl = './dist/win-unpacked/resources/elevate.exe'
    } else {
      //  打包后的 resources 文件夹内获取
      elevateUrl = `./resources/elevate.exe`
    }

    const callUsingElevation = (args) => {
      spawnExpand(elevateUrl, [exePath].concat(args)).catch((e) => {
        log.error('elevateUrl e ', e)
      })
    }

    return new Promise((resolve, reject) => {
      const args = ['--updated', '/S', '--force-run']
      spawnExpand(exePath, ['--updated', '/S', '--force-run']).catch((e) => {
        // https://github.com/electron-userland/electron-builder/issues/1129
        // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
        const errorCode = e.code
        console.error(
          `Cannot run installer: error code: ${errorCode}, error message: "${e.message}", will be executed again using elevate if EACCES"`
        )
        if (errorCode === 'UNKNOWN' || errorCode === 'EACCES') {
          console.log('errorCode', e)
          callUsingElevation(args, exePath)
        } else {
          console.log('e', e)
          // this.dispatchError(e)
        }
      })
    })
  }
  /**
   * 用户手动退出并安装
   * @param path：安装包目录
   */
  const quitAndInstallByUser = (pathInfo: string) => {
    // TODO 处理退出前需要执行的内容
    execInstall(pathInfo)
  }

  // item.on('done', (e, state) => {
  //   log.info({
  //     state: state,
  //     receivedBytes: item.getReceivedBytes(),
  //     lastModifiedTime: item.getLastModifiedTime()
  //   })
  // })
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.ttime')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // app.quit()
  }
})

/**
 * 全局异常捕获
 */
process.on('uncaughtException', (err, _origin) => {
  // 收集日志
  log.error('全局异常捕获 err = ', err)
  // 显示异常提示信息或者重新加载应用
})

/**
 * 打开设置页面
 */
ipcMain.handle('open-set-page-event', (_event) => {
  createSetWindow()
})

/**
 * 获取系统类型事件
 */
ipcMain.on('get-system-type-event', (event, _args) => {
  event.returnValue = SystemTypeEnum.getSystemType()
})

/**
 * 跳转页面
 */
ipcMain.on('jump-to-page-event', (_event, url) => {
  if (isNull(url)) {
    return
  }
  shell.openExternal(url)
})

/**
 * 日志 - info级别
 */
ipcMain.handle('log-info-event', (_event, ...text) => {
  log.info(...text)
})

/**
 * 日志 - error级别
 */
ipcMain.handle('log-error-event', (_event, ...text) => {
  log.error(...text)
})

/**
 * 退出应用
 */
ipcMain.handle('close-app-event', (_event) => {
  GlobalWin.closeApp()
})

/**
 * 获取版本事件
 */
ipcMain.on('get-version-event', (event) => {
  event.returnValue = version
})

/**
 * 代理更新事件
 */
ipcMain.handle('agent-update-event', (_event, agentConfig) => {
  injectWinAgent(agentConfig, mainWin.webContents.session)
})
