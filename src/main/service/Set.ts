import { BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import * as fse from 'fs-extra'
import { is } from '@electron-toolkit/utils'
import { GlobalShortcutEvent } from './GlobalShortcutEvent'
import R from '../../common/class/R'
import log from '../utils/log'
import { isNotNull, isNull } from '../../common/utils/validate'
import GlobalWin from './GlobalWin'
import { SystemTypeEnum } from '../enums/SystemTypeEnum'
import { StoreTypeEnum } from '../../common/enums/StoreTypeEnum'
import StoreService from './StoreService'
import { StoreConfigFunTypeEnum } from '../../common/enums/StoreConfigFunTypeEnum'
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions

let nullWin: BrowserWindow

let setWin: BrowserWindow

function createSetWindow(): void {
  if (null != setWin) {
    setWin.show()
    return
  }

  // 是否Mac系统
  const isMac = SystemTypeEnum.isMac()

  let setWinConfig: BrowserWindowConstructorOptions = {
    width: 850,
    height: 600,
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
    title: 'TTime设置',
    // 设置任务栏图标
    icon: path.join(__dirname, '../../public/icon-1024x1024.png'),
    webPreferences: {
      preload: path.join(__dirname, '../preload/set.js'),
      sandbox: false
    }
  }

  // 是否Mac环境
  if (isMac) {
    // Mac环境下加载配置 此处为了兼容显示窗口红绿灯
    // 部分Win系统中加入配置可能存在不兼容问题 导致窗口显示时会出现黑阴影
    setWinConfig = {
      ...setWinConfig,
      // 默认不显示窗口
      show: false,
      // Mac 环境下设置窗口中的关闭按钮使用 Mac 原生的红绿灯
      titleBarStyle: SystemTypeEnum.isMac() ? 'hidden' : 'default',
      // 自定义macOS上的红绿灯位置
      trafficLightPosition: { x: 20, y: 10 }
    }
  }

  setWin = new BrowserWindow(setWinConfig)
  // 禁用按下F11全屏事件
  setWin.setFullScreenable(false)
  GlobalWin.setSetWin(setWin)

  if (isMac) {
    // Mac环境下才在窗口加载完毕后显示 此处为了兼容显示窗口红绿灯
    // 部分Win系统中加入配置可能存在不兼容问题 导致窗口显示时会出现黑阴影
    setWin.on('ready-to-show', () => {
      setWin.show()
    })
  }

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    setWin.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/set.html`)
  } else {
    setWin.loadFile(path.join(__dirname, '../renderer/set.html'))
  }

  // 当 window 被关闭，这个事件会被触发。
  setWin.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持    多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    setWin = nullWin
    GlobalWin.setSetWin(null)
  })

  // 设置窗口获取焦点事件
  setWin.on('focus', () => {
    GlobalWin.setWin.webContents.send('set-win-focus-event')
  })
}

/**
 * 更新翻译快捷键事件
 */
ipcMain.on('update-translate-shortcutKey-event', (event, type, oldShortcutKey, shortcutKey) => {
  // 如果原快捷键不为空 但新快捷键为空则直接注销之前的快捷键
  if (isNotNull(oldShortcutKey) && isNull(shortcutKey)) {
    log.info(' 更新翻译快捷键事件 translateInput 移除 [', oldShortcutKey, '] 快捷键')
    GlobalShortcutEvent.unregister(oldShortcutKey)
    event.returnValue = R.ok()
    return
  }
  // 翻译快捷键根据类型注册
  const response = GlobalShortcutEvent.translateRegister(type, shortcutKey)
  log.info(' 更新翻译快捷键事件 translateInput response = ', response)
  // 如果 旧翻译快捷键 存在 并且 新的翻译快捷键 已注册完毕则移除旧的翻译快捷键
  if (isNotNull(oldShortcutKey) && response.code === 1) {
    log.info(' 更新翻译快捷键事件 translateInput 移除 [', oldShortcutKey, '] 快捷键')
    GlobalShortcutEvent.unregister(oldShortcutKey)
  }
  event.returnValue = response
})

/**
 * 关闭设置窗口事件
 */
ipcMain.handle('close-set-win-event', (_event, _args) => {
  setWin.close()
})

/**
 * 更新翻译源通知
 *
 * @param channel 翻译类型
 * @param info    翻译信息
 */
ipcMain.handle('update-translate-service-event', (_event, _args) => {
  GlobalWin.mainWinSend('update-translate-service-event')
})

/**
 * 更新置顶时允许隐藏窗口选择事件通知
 */
ipcMain.handle('always-onTop-allow-esc-status-notify', (_event, _args) => {
  GlobalWin.mainOrOcrWinShowCallback()
})

/**
 * 更新配置信息路径
 */
ipcMain.on('update-config-info-path', (event, storeConfigFunType, storeType, directoryPath) => {
  directoryPath = path.join(directoryPath, StoreService.userDataConfigFolderName)
  let oldFilePath, oldPath
  if (storeType === StoreTypeEnum.CONFIG) {
    oldFilePath = StoreService.configStore.path
    oldPath = StoreService.systemGet(StoreService.configName)
  } else if (storeType === StoreTypeEnum.HISTORY_RECORD) {
    oldFilePath = StoreService.historyRecordStore.path
    oldPath = StoreService.systemGet(StoreService.historyRecordName)
  }
  const fileName = oldFilePath.replaceAll(oldPath, '')
  const newFilePath = path.join(directoryPath, fileName)
  if (oldFilePath === newFilePath) {
    event.returnValue = R.error('文件路径未修改')
    return
  }

  if (StoreConfigFunTypeEnum.MOVE === storeConfigFunType) {
    fse
      .move(oldFilePath, newFilePath)
      .then(() => {
        updateStoreConfig(storeType, directoryPath)
        event.returnValue = R.okD(directoryPath)
      })
      .catch((err) => {
        log.error(err)
        // 当修改翻译记录的路径时 如果新安装还未翻译过将会导致没有生成翻译记录文件
        // 这里校验一下 如果没有的话则进行迁移
        if (err.message.indexOf('no such file or directory') != -1) {
          updateStoreConfig(storeType, directoryPath)
          event.returnValue = R.okD(directoryPath)
          return
        } else if (err.message.indexOf('dest already exists') != -1) {
          event.returnValue = R.error('移动失败，移动的路径下已经存在配置')
          return
        }
        event.returnValue = R.error('修改失败，未知错误，如重复出现请联系作者')
      })
  } else if (StoreConfigFunTypeEnum.SWITCH === storeConfigFunType) {
    updateStoreConfig(storeType, directoryPath)
    event.returnValue = R.okD(directoryPath)
  }
})

const updateStoreConfig = (storeType, directoryPath): void => {
  if (storeType === StoreTypeEnum.CONFIG) {
    StoreService.systemSet(StoreService.configName, directoryPath)
  } else if (storeType === StoreTypeEnum.HISTORY_RECORD) {
    StoreService.systemSet(StoreService.historyRecordName, directoryPath)
  }
  StoreService.init()
}

export default createSetWindow
