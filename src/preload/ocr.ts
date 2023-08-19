import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import common from './common'

/**
 * 关闭窗口事件
 */
const closeOcrWinEvent = (): void => {
  ipcRenderer.invoke('close-ocr-win-event')
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

/**
 * 图片写入剪切板事件
 */
const base64ImgWriteShearPlateEvent = (base64Img): void => {
  ipcRenderer.invoke('base64-img-write-shear-plate-event', base64Img)
}

/**
 * 调起翻译
 */
const updateTranslatedContentEvent = (text): void => {
  ipcRenderer.invoke('update-translated-content-event', text)
}

// Custom APIs for renderer
const api = {
  ...common,
  closeOcrWinEvent,
  ocrAlwaysOnTopEvent,
  updateImg,
  updateText,
  winSizeUpdate,
  base64ImgWriteShearPlateEvent,
  updateTranslatedContentEvent
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
