import { app, BrowserWindow, ipcMain } from 'electron'
import log from '../utils/log'
import { AutoUpdaterEnum } from '../enums/AutoUpdaterEnum'
import { UpdateStatusEnum } from '../enums/UpdateStatusEnum'
import { isNotNull, isNull } from '../../common/utils/validate'
import path from 'path'
import { is } from '@electron-toolkit/utils'
import TTimeRequest from './channel/interfaces/TTimeRequest'
import { TrayEvent } from './TrayEvent'
import GlobalWin from './GlobalWin'
import { spawn } from 'child_process'
import { YesNoEnum } from '../../common/enums/YesNoEnum'
import fs from 'fs'
import { WinEvent } from './Win'
import StoreService from './StoreService'

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
  static newVersionPath = path.join(app.getPath('userData') + '/newVersion/TTime-setup.exe')

  /**
   * 是否已下载新版本
   */
  static isDownloadNewVersion = false

  /**
   * 新版本下载地址
   */
  static newVersionDownloadUrl = ''

  constructor() {
    // 启动后自动检测一次
    setTimeout(() => {
      log.info('[检测安装包事件] 检测 - 开始')
      // 检测之前下载的包是否存在 存在则进行删除
      fs.exists(AutoUpdater.newVersionPath, (exists) => {
        if (!exists) {
          log.info('[检测安装包事件] 检测 - 结束')
          return
        }
        log.info('[检测安装包事件] 存在旧版本安装包，开始清理')
        setTimeout(async () => {
          // 此处的逻辑是因为由于在手动安装时是默认勾选开机自启的
          // 而当自动更新时，直接跳过了勾选开启自启的那个选项，导致开启自启功能被关闭了
          // 所以在自动更新安装时会先获取当前开启自启的状态
          // 然后在安装完毕后启动时读取之前存储的状态再次进行设置开启自启状态
          let autoLaunchFront = StoreService.configGet('autoLaunchFront')
          if (isNull(autoLaunchFront)) {
            // 如果首次从 localStorage 存储环境切换到 store 方式存储时
            // 静默更新状态下会获取不到自动开机状态
            // 所以当 autoLaunchFront 为空的情况下则再从 localStorage 读取初始状态
            await GlobalWin.mainWin.webContents
              .executeJavaScript('localStorage.autoLaunchFront')
              .then((valExtend) => {
                autoLaunchFront = valExtend
              })
          }
          // 校验是否不为空
          // 因为有的时候删除安装包失败的情况下 这里会重复触发 所以可能会出现为空的情况
          if (isNotNull(autoLaunchFront)) {
            const isEnabled = autoLaunchFront === YesNoEnum.Y
            // 延迟检测 防止注册表还没有完全添加完毕状态下就获取了
            setTimeout(() => {
              // 设置开启自启状态
              WinEvent.updateAutoLaunch(isEnabled, () => {
                return isEnabled
              })
              // 更新存储库的状态
              StoreService.configSet('autoLaunch', isEnabled ? YesNoEnum.Y : YesNoEnum.N)
              // 移除自动更新安装时临时存储的开机自启状态
              StoreService.configDeleteByKey('autoLaunchFront')
              GlobalWin.mainWin.webContents.executeJavaScript(
                "localStorage.removeItem('autoLaunchFront')"
              )
            }, 5000)
          }
        }, 1000)
        fs.unlink(AutoUpdater.newVersionPath, (e) => {
          // 移除成功后 e 回调为 null
          if (e) {
            log.error('[检测安装包事件] 旧版本安装包清理异常', e)
            return
          }
          log.info('[检测安装包事件] 旧版本安装包清理成功')
        })
      })
      AutoUpdater.autoUpdaterStartCheck()
    }, 1000 * 10)
    // 每12小时检测一次
    setInterval(() => {
      AutoUpdater.autoUpdaterStartCheck()
    }, 1000 * 60 * 60 * 12)
  }

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
      // 设置默认路径
      item.setSavePath(AutoUpdater.newVersionPath)
      //获取文件的总大小
      const totalBytes = item.getTotalBytes()
      /**
       * 下载中事件
       */
      item.on('updated', (_event, state) => {
        if (state === 'interrupted') {
          AutoUpdater.autoUpdaterSendEventByMsg(AutoUpdaterEnum.ERROR, '下载中断，请检查网络后再试')
          log.info('[新版本下载事件] 触发了下载打断状态')
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            AutoUpdater.autoUpdaterSendEventByMsg(
              AutoUpdaterEnum.ERROR,
              '下载中断，请检查网络后再试'
            )
            log.info('[新版本下载事件] 触发了下载暂停状态')
          } else {
            let percent = item.getReceivedBytes() / totalBytes
            percent = Math.round(percent * 100)
            log.info(`[新版本下载事件] 下载进度 : ${percent}`)
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
          log.info('[新版本下载事件] 下载完毕')
          AutoUpdater.autoUpdaterSendEvent(AutoUpdaterEnum.UPDATE_DOWNLOADED, '下载完成')
          // 是否下载新版本状态设置为成功
          AutoUpdater.isDownloadNewVersion = true
        } else {
          AutoUpdater.autoUpdaterSendEventByMsg(AutoUpdaterEnum.ERROR, `下载失败: ${state}`)
          log.info(`[新版本下载事件] 下载失败: ${state}`)
        }
      })
    })
  }

  /**
   * 强制更新
   */
  static forcedUpdate(info): void {
    log.info('当前版本 : ', thisVersion, ' , 开始强制更新')
    AutoUpdater.autoUpdaterSendEvent(AutoUpdaterEnum.UPDATE_AVAILABLE, {
      ...info,
      forcedUpdate: true
    })
  }

  /**
   * 检测更新
   */
  static checkUpdate(info): void {
    // 设置强制更新状态
    AutoUpdater.autoUpdaterSendEvent(AutoUpdaterEnum.UPDATE_AVAILABLE, info)
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const data = res.data
        const updateStatus = data['updateStatus']
        const newVersion = data['newVersion']
        const newStatus = data['newStatus']
        const updateContent = data['updateContent']
        const downloadType = data['downloadType']
        AutoUpdater.newVersionDownloadUrl = data['downloadUrl']
        // const updateStatus = 1
        // const newVersion = data['newVersion']
        // const newStatus = true
        // const updateContent = data['updateContent']
        // const downloadType = 1
        // AutoUpdater.newVersionDownloadUrl = ''
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
          AutoUpdater.checkUpdate({
            newVersion,
            updateContent,
            downloadType
          })
        } else if (updateStatus === UpdateStatusEnum.FORCED) {
          // 当有新版本时 关闭静默检测
          AutoUpdater.isSilence = false
          AutoUpdater.forcedUpdate({
            newVersion: newVersion + ' - 此版本须必更',
            updateContent,
            downloadType
          })
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
   * 自动更新检测
   */
  static autoUpdaterStartCheck(): void {
    const autoUpdater = StoreService.configGet('autoUpdater')
    if (YesNoEnum.Y === autoUpdater) {
      // 静默更新检测
      AutoUpdater.startCheck(true)
    }
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
    log.info('[新版本安装] 执行安装')
    this.execInstall(AutoUpdater.newVersionPath)
      .then(() => {
        // 调用成功后关闭窗口
        updateWin.close()
      })
      .catch((e) => {
        log.error('[新版本安装] 安装异常', e)
        AutoUpdater.autoUpdaterSendEventByMsg(AutoUpdaterEnum.ERROR, '调起安装任务失败')
      })
  }

  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  static spawnExpandFun = (exe, args): Promise<boolean> => {
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
  static execInstall = (exePath): Promise<void> => {
    return new Promise((resolve, reject) => {
      const args = ['--updated', '/S', '--force-run']
      AutoUpdater.spawnExpandFun(exePath, args).catch((e) => {
        const errorCode = e.code
        if (errorCode !== 'UNKNOWN' && errorCode !== 'EACCES') {
          log.error('[新版本安装] 安装异常', e)
          reject(e)
          return
        }
        // elevate.exe 主要用于解决运行权限问题
        let elevatePath = '../../plugins/elevate.exe'
        if (app.isPackaged) {
          elevatePath = '../../../app.asar.unpacked/plugins/elevate.exe'
        }
        elevatePath = path.join(__dirname, elevatePath)
        log.info('[新版本安装] 开始提权安装')
        AutoUpdater.spawnExpandFun(elevatePath, [exePath].concat(args))
          .then(async () => {
            log.info('[新版本安装] 调起安装命令成功')
            // 此处的逻辑是因为由于在手动安装时是默认勾选开机自启的
            // 而当自动更新时，直接跳过了勾选开启自启的那个选项，导致开启自启功能被关闭了
            // 所以在自动更新安装时会先获取当前开启自启的状态
            // 然后在安装完毕后启动时读取之前存储的状态再次进行设置开启自启状态
            let autoLaunch = StoreService.configGet('autoLaunch')
            if (isNull(autoLaunch)) {
              // 如果首次从 localStorage 存储环境切换到 store 方式存储时
              // 静默更新状态下会获取不到自动开机状态
              // 所以当 autoLaunch 为空的情况下则再从 localStorage 读取初始状态
              await GlobalWin.mainWin.webContents
                .executeJavaScript('localStorage.autoLaunch')
                .then((valExtend) => {
                  autoLaunch = valExtend
                })
            }
            StoreService.configSet(
              'autoLaunchFront',
              autoLaunch === YesNoEnum.Y ? YesNoEnum.Y : YesNoEnum.N
            )
            resolve()
          })
          .catch((e) => {
            log.error('[新版本安装] 提权安装异常', e)
            reject(e)
          })
      })
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
  if (AutoUpdater.isDownloadNewVersion) {
    AutoUpdater.autoUpdaterSendEvent(AutoUpdaterEnum.UPDATE_DOWNLOADED, '下载完成')
    return
  }
  // 触发下载
  updateWin.webContents.downloadURL(AutoUpdater.newVersionDownloadUrl)
})

/**
 * 开始安装新版本 - 下载完成后可触发
 */
ipcMain.handle('auto-updater-start-install', () => {
  AutoUpdater.startInstall()
})

export default AutoUpdater
