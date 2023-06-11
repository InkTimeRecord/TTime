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

/**
 * 窗口显示消息提示
 *
 * @param callback 回调方法
 */
const showMsgEvent = (callback): void => {
  ipcRenderer.on('show-msg-event', (_event, type, msg) => {
    callback(type, msg)
  })
}

/**
 * 始终在最前面
 */
const ocrAlwaysOnTopEvent = (status): void => {
  ipcRenderer.invoke('ocr-always-on-top-event', status)
}

/**
 * 窗口大小更新
 */
const winSizeUpdate = (callback): void => {
  ipcRenderer.on('win-size-update', (_event, newBounds) => {
    callback(newBounds)
  })
}

/**
 * 更新图片
 *
 * @param callback 回调方法
 */
const updateImg = (callback): void => {
  ipcRenderer.on('update-img', (_event, img) => {
    callback(img)
  })
}

/**
 * 更新文本
 *
 * @param callback 回调方法
 */
const updateText = (callback): void => {
  ipcRenderer.on('update-text', (_event, text) => {
    callback(text)
  })
}

// Custom APIs for renderer
const api = {
  closeOcrWinEvent,
  getSystemTypeEvent,
  showMsgEvent,
  ocrAlwaysOnTopEvent,
  updateImg,
  updateText,
  winSizeUpdate
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
