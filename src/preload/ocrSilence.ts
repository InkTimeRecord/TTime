import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import common from './common'

const hoverBallEvents = (): void => {
  ipcRenderer.invoke('hover-ball-events')
}

const hoverBallShowEvents = (callback): void => {
  ipcRenderer.on('hover-ball-show-events', () => {
    callback()
  })
}

const hoverBallHideEvents = (callback): void => {
  ipcRenderer.on('hover-ball-hide-events', () => {
    callback()
  })
}

const api = {
  ...common,
  hoverBallEvents,
  hoverBallShowEvents,
  hoverBallHideEvents
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
