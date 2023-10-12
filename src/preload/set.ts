import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import common from './common'
import R from '../common/class/R'

const updateTranslateShortcutKeyEvent = (type, oldShortcutKey, shortcutKey, callback): void => {
  const res = ipcRenderer.sendSync(
    'update-translate-shortcutKey-event',
    type,
    oldShortcutKey,
    shortcutKey
  )
  callback(res)
}

/**
 * 关闭设置窗口事件
 */
const closeSetWinEvent = (): void => {
  ipcRenderer.invoke('close-set-win-event')
}

/**
 * 开机自启事件
 *
 * @param status 开机自启状态
 */
const autoLaunchEvent = (status): void => {
  ipcRenderer.invoke('auto-launch-event', status)
}

/**
 * 自动检测更新事件
 *
 * @param status 自动检测更新状态
 */
const autoUpdaterEvent = (status): void => {
  ipcRenderer.invoke('auto-updater-event', status)
}

/**
 * 静默更新事件
 */
const autoUpdaterSilenceStartCheckEvent = (): void => {
  ipcRenderer.invoke('auto-updater-silence-start-check')
}

/**
 * 更新翻译源通知
 */
const updateTranslateServiceNotify = (): void => {
  ipcRenderer.invoke('update-translate-service-notify')
}

/**
 * 统一翻译校验
 */
const apiUniteTranslateCheck = (type, info): void => {
  ipcRenderer.invoke('api-unite-translate-check', type, info)
}

/**
 * 统一翻译校验回调
 */
const apiCheckTranslateCallbackEvent = (callback): void => {
  ipcRenderer.on('api-check-translate-callback-event', (_event, type, res) => {
    callback(type, res)
  })
}

/**
 * 统一Ocr校验
 */
const apiUniteOcrCheck = (type, info): void => {
  ipcRenderer.invoke('api-unite-ocr-check', type, info)
}

/**
 * 统一Ocr校验回调
 */
const apiCheckOcrCallbackEvent = (callback): void => {
  ipcRenderer.on('api-check-ocr-callback-event', (_event, type, res) => {
    callback(type, res)
  })
}

/**
 * 代理更新事件
 *
 * @param agentConfig 代理配置
 */
const agentUpdateEvent = (agentConfig): void => {
  ipcRenderer.invoke('agent-update-event', agentConfig)
}

/**
 * 更新置顶时允许隐藏窗口选择事件通知
 */
const alwaysOnTopAllowEscStatusNotify = (): void => {
  ipcRenderer.invoke('always-onTop-allow-esc-status-notify')
}

/**
 * 打开目录对话框
 */
const openDirectoryDialog = (storeConfigFunType, storeType): void => {
  ipcRenderer.send('open-directory-dialog', storeConfigFunType, storeType)
}

/**
 * 打开目录对话框回调
 */
const openDirectoryDialogCallback = (callback): void => {
  ipcRenderer.on(
    'open-directory-dialog-callback',
    (_event, storeConfigFunType, storeType, directoryPath) => {
      callback(storeConfigFunType, storeType, directoryPath)
    }
  )
}

/**
 * 更新配置信息路径
 */
const updateConfigInfoPath = (storeConfigFunType, storeType, directoryPath): R => {
  return ipcRenderer.sendSync(
    'update-config-info-path',
    storeConfigFunType,
    storeType,
    directoryPath
  )
}

/**
 * 设置窗口获取焦点事件
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const setWinFocusEvent = (callback): void => {
  ipcRenderer.on('set-win-focus-event', (_event) => {
    callback()
  })
}

/**
 * 窗口字体大小更新通知
 */
const winFontSizeNotify = (): void => {
  ipcRenderer.invoke('win-font-size-notify')
}

/**
 * 窗口显示事件
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const winShowEvent = (callback): void => {
  ipcRenderer.on('win-show-event', () => {
    callback()
  })
}

/**
 * 刷新用户信息
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const refreshUserInfoEvent = (callback): void => {
  ipcRenderer.on('refresh-user-info-event', () => {
    callback()
  })
}
/**
 * 刷新服务信息
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const refreshServiceInfoEvent = (callback): void => {
  ipcRenderer.on('refresh-service-info-event', () => {
    callback()
  })
}

/**
 * 刷新服务信息通知
 */
const refreshServiceInfoNotify = (): void => {
  ipcRenderer.invoke('refresh-service-info-notify')
}

/**
 * 登录成功回调
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const loginSuccessEvent = (callback): void => {
  ipcRenderer.on('login-success-event', () => {
    callback()
  })
}

const api = {
  ...common,
  updateTranslateShortcutKeyEvent,
  closeSetWinEvent,
  autoLaunchEvent,
  autoUpdaterEvent,
  autoUpdaterSilenceStartCheckEvent,
  updateTranslateServiceNotify,
  apiUniteTranslateCheck,
  apiCheckTranslateCallbackEvent,
  apiUniteOcrCheck,
  apiCheckOcrCallbackEvent,
  agentUpdateEvent,
  alwaysOnTopAllowEscStatusNotify,
  openDirectoryDialog,
  openDirectoryDialogCallback,
  updateConfigInfoPath,
  setWinFocusEvent,
  winFontSizeNotify,
  winShowEvent,
  refreshUserInfoEvent,
  refreshServiceInfoEvent,
  refreshServiceInfoNotify,
  loginSuccessEvent
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
