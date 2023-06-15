import { app, BrowserWindow, ipcMain } from 'electron'
import log from '../utils/log'
import { AutoUpdaterEnum } from '../enums/AutoUpdaterEnum'
import { UpdateStatusEnum } from '../enums/UpdateStatusEnum'
import { isNotNull } from '../utils/validate'
import path from 'path'
import { is } from '@electron-toolkit/utils'
import TTimeRequest from './channel/interfaces/TTimeRequest'
import { TrayEvent } from './TrayEvent'
import GlobalWin from './GlobalWin'
import { EnvEnum } from '../enums/EnvEnum'
import { spawn } from 'child_process'

let nullWin: BrowserWindow

// 当前软件版本
const thisVersion = app.getVersion()

/**
 * 更新窗口
 */
let updateWin: BrowserWindow
/**
 * 窗口是否已创建
 */
let isWinCreate = false

/**
 * 自动更新
 */
class AutoUpdater {
  static message = {
    error: '如重复出现，请检查网络或联系作者',
    checking: '检查新版本中...',
    updateAva: '检测到新版本',
    updateNotAva: '当前已是最新版本'
  }

  /**
   * 是否静默安装
   */
  static isSilence = false

  /**
   * 新版本下载路径
   */
  static newVersionPath

  /**
   * 创建窗口
   */
  static createWin(callback): void {
    if (AutoUpdater.isSilence) {
      return
    }
    if (isNotNull(updateWin)) {
      // 这里循环等待的原因是因为有可能窗口已经实例化了 但是还没有创建完毕
      // 所以这里循环等待创建完毕 每 0.5 秒检测一次 一共等待 3 秒
      const i = 0
      const intervalIndex = setInterval(() => {
        if (!isWinCreate && i >= 6) {
          // 如果循环了6次之后窗口还没有实例化完毕则停止等待
          log.info('等待更新窗口创建完毕超时，停止事件发送')
          clearInterval(intervalIndex)
        } else if (isWinCreate) {
          callback()
          clearInterval(intervalIndex)
        }
      }, 500)
      return
    }
    updateWin = new BrowserWindow({
      width: 500,
      height: 380,
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
      title: 'TTime更新',
      // 设置任务栏图标
      icon: path.join(__dirname, '../../public/icon-1024x1024.png'),
      webPreferences: {
        preload: path.join(__dirname, '../preload/update.js'),
        sandbox: false
      }
    })
    // 禁用按下F11全屏事件
    updateWin.setFullScreenable(false)
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      updateWin.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/update.html`)
    } else {
      updateWin.loadFile(path.join(__dirname, '../renderer/update.html'))
    }
    // 当 window 被关闭，这个事件会被触发。
    updateWin.on('closed', () => {
      updateWin = nullWin
      isWinCreate = false
    })
    updateWin.on('ready-to-show', () => {
      // 加载完毕后显示
      updateWin.show()
      callback()
      isWinCreate = true
    })
    // updateWin.webContents.openDevTools({ mode: 'detach' })

    // 监听下载事件
    updateWin.webContents.session.on('will-download', (_event, item, _webContents) => {
      // 新版本下载路径
      AutoUpdater.newVersionPath = path.join(
        app.getPath('userData') + '/newVersion/',
        item.getFilename()
      )
      // 设置默认路径
      item.setSavePath(AutoUpdater.newVersionPath)
      //获取文件的总大小
      const totalBytes = item.getTotalBytes()
      /**
       * 下载中事件
       */
      item.on('updated', (_event, state) => {
        if (state === 'interrupted') {
          log.info('下载被打断')
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            log.info('下载暂停了')
          } else {
            let percent = item.getReceivedBytes() / totalBytes
            percent = Math.round(percent * 100)
            log.info(`下载中 process : ${percent}`)
            AutoUpdater.autoUpdaterSendEvent(AutoUpdaterEnum.DOWNLOAD_PROGRESS, {
              percent
            })
          }
        }
      })

      /**
       * 下载完成事件
       */
      item.once('done', (_event, state) => {
        if (state === 'completed') {
          log.info('下载完毕')
          AutoUpdater.autoUpdaterSendEvent(AutoUpdaterEnum.UPDATE_DOWNLOADED, '下载完成')
          // quitAndInstall(newVersionPath)
        } else {
          log.info(`下载失败: ${state}`)
        }
      })
    })
  }

  /**
   * 强制更新
   */
  static forcedUpdate(newVersion, content): void {
    log.info('当前版本 : ', thisVersion, ' , 开始强制更新')
    AutoUpdater.autoUpdaterSendEvent(AutoUpdaterEnum.UPDATE_AVAILABLE, {
      newVersion: newVersion,
      releaseNotes: content,
      forcedUpdate: true
    })
  }

  /**
   * 检测更新
   */
  static checkUpdate(newVersion, content): void {
    // 设置强制更新状态
    AutoUpdater.autoUpdaterSendEvent(AutoUpdaterEnum.UPDATE_AVAILABLE, {
      newVersion: newVersion,
      releaseNotes: content
    })
  }

  /**
   * 更新检测
   */
  static startCheck(isSilence): void {
    AutoUpdater.isSilence = isSilence
    log.info('当前版本 : ', thisVersion, ' , 开始更新检测')
    AutoUpdater.autoUpdaterSendEventByMsg(
      AutoUpdaterEnum.CHECKING_FOR_UPDATE,
      AutoUpdater.message.checking
    )
    log.info('[获取版本信息接口调用] - 开始 ')
    TTimeRequest.getVersionInfo()
      .then((res) => {
        log.info('[获取版本信息接口调用] - 响应报文 : ', JSON.stringify(res))
        const data = res.data
        const updateStatus = data['updateStatus']
        const newVersion = data['newVersion']
        const newStatus = data['newStatus']
        const updateContent = data['updateContent']
        // updateStatus = 0
        // newVersion = '0.0.5'
        // newStatus = true
        // updateContent = '测试更新内容'
        if (!newStatus || updateStatus === UpdateStatusEnum.UNWANTED) {
          log.info('版本检测结束 , 当前版本 : ', thisVersion, ' , 无需更新')
          AutoUpdater.autoUpdaterSendEventByMsg(
            AutoUpdaterEnum.UPDATE_NOT_AVAILABLE,
            AutoUpdater.message.updateNotAva
          )
          return
        }
        log.info(
          '版本检测结束 , 新版本状态 : ',
          newStatus,
          ' , 当前版本 : ',
          thisVersion,
          ' , 最新版本 : ',
          newVersion
        )
        if (updateStatus === UpdateStatusEnum.TIPS) {
          // 当有新版本时 关闭静默检测
          AutoUpdater.isSilence = false
          AutoUpdater.checkUpdate(newVersion, updateContent)
        } else if (updateStatus === UpdateStatusEnum.FORCED) {
          // 当有新版本时 关闭静默检测
          AutoUpdater.isSilence = false
          AutoUpdater.forcedUpdate(newVersion + ' - 此版本须必更', updateContent)
          // 设置主窗口为可关闭状态
          GlobalWin.isMainWinClose = true
          // 销毁托盘菜单
          TrayEvent.mainTray.destroy()
          // 销毁主窗口
          GlobalWin.mainWin.close()
        }
      })
      .catch((error) => {
        log.error(
          '[获取版本信息接口调用] - 调用异常 , 当前版本 : ',
          thisVersion,
          ' , 错误信息 : ',
          error
        )
        let msg = AutoUpdater.message.error
        const message = error.message
        if (message.indexOf('502 Bad Gateway') !== -1) {
          msg = '检测更新网络异常，请检查网络再试，如重复出现请联系作者'
        }
        AutoUpdater.autoUpdaterSendEventByMsg(AutoUpdaterEnum.ERROR, msg)
      })
  }

  /**
   * 更新状态发送事件
   *
   * @param autoUpdaterEnum 自动更新枚举
   * @param data 更新数据
   */
  static autoUpdaterSendEvent(autoUpdaterEnum, data): void {
    data = { ...data, thisVersion }
    AutoUpdater.createWin(() => {
      updateWin.webContents.send('auto-updater-event', autoUpdaterEnum, data)
    })
  }

  /**
   * 更新状态发送事件
   *
   * @param autoUpdaterEnum 自动更新枚举
   * @param msg 更新消息
   */
  static autoUpdaterSendEventByMsg(autoUpdaterEnum, msg): void {
    this.autoUpdaterSendEvent(autoUpdaterEnum, {
      message: msg
    })
  }

  /**
   * 开始安装新版本 - 下载完成后触发
   */
  static startInstall(): void {
    this.quitAndInstall(AutoUpdater.newVersionPath)
  }

  /**
   * 用户手动退出并安装
   * @param pathInfo 安装包目录
   */
  static quitAndInstall = (pathInfo: string): void => {
    // TODO 处理退出前需要执行的内容
    this.execInstall(pathInfo).then()
  }

  /**
   * 执行安装
   */
  static execInstall = (exePath): Promise<void> => {
    return new Promise(() => {
      const args = ['--updated', '/S', '--force-run']
      this.spawnExpand(exePath, ['--updated', '/S', '--force-run']).catch((e) => {
        const errorCode = e.code
        log.error(
          `Cannot run installer: error code: ${errorCode}, error message: "${e.message}", will be executed again using elevate if EACCES"`
        )
        if (errorCode === 'UNKNOWN' || errorCode === 'EACCES') {
          console.log('需要权限更新')
          // elevate.exe 主要用于解决运行权限问题
          let elevatePath = './resources/elevate.exe'
          if (EnvEnum.isDev()) {
            elevatePath = './dist/win-unpacked/resources/elevate.exe'
          }
          this.spawnExpand(elevatePath, [exePath].concat(args)).catch((e) => {
            log.error('elevateUrl e ', e)
          })
        } else {
          log.error('安装异常 e ', e)
        }
      })
    })
  }

  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  static spawnExpand = async (exe, args): Promise<boolean> => {
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
}

/**
 * 更新检测
 */
ipcMain.handle('auto-updater-start-check', () => {
  // 设置非静默更新状态
  AutoUpdater.startCheck(false)
})

/**
 * 静默更新检测
 */
ipcMain.handle('auto-updater-silence-start-check', () => {
  // 设置静默更新状态
  AutoUpdater.startCheck(true)
})

/**
 * 关闭设置窗口事件
 */
ipcMain.handle('close-update-win-event', (_event, _args) => {
  updateWin.close()
})

/**
 * 自动更新开始下载
 */
ipcMain.handle('auto-updater-start-download', () => {
  // 触发下载
  updateWin.webContents.downloadURL(
    'https://gitcode.net/qq_37346938/TTime/-/raw/main/version/TTime-0.3.0-setup.exe'
  )
})

/**
 * 开始安装新版本 - 下载完成后触发
 */
ipcMain.handle('auto-updater-start-install', () => {
  AutoUpdater.startInstall()
})

export default AutoUpdater
