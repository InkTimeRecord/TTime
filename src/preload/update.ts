import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import common from './common'

/**
 * 关闭设置窗口事件
 */
const closeUpdateWinEvent = (): void => {
  ipcRenderer.invoke('close-update-win-event')
}

/**
 * 自动更新事件
 *
 * @param callback 回调方法
 */
const autoUpdaterEvent = (callback): void => {
  ipcRenderer.on('auto-updater-event', (_event, eventType, res) => {
    callback(eventType, res)
  })
}

/**
 * 手动触发检测更新事件
 */
const autoUpdaterStartCheck = (): void => {
  ipcRenderer.invoke('auto-updater-start-check')
}

/**
 * 开始下载
 */
const autoUpdaterStartDownload = (): void => {
  ipcRenderer.invoke('auto-updater-start-download')
}

/**
 * 开始安装
 */
const autoUpdaterStartInstall = (): void => {
  ipcRenderer.invoke('auto-updater-start-install')
}

const api = {
  ...common,
  closeUpdateWinEvent,
  autoUpdaterEvent,
  autoUpdaterStartCheck,
  autoUpdaterStartDownload,
  autoUpdaterStartInstall
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
