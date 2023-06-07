import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

/**
 * 关闭窗口事件
 */
const closeOcrWinEvent = (): void => {
  ipcRenderer.invoke('close-ocr-win-event')
}

/**
 * 获取系统类型
 */
const getSystemTypeEvent = (): string => {
  return ipcRenderer.sendSync('get-system-type-event')
}

// Custom APIs for renderer
const api = {
  closeOcrWinEvent,
  getSystemTypeEvent
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
