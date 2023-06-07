import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface api {
    closeOcrWinEvent
    getSystemTypeEvent
  }

  interface Window {
    electron: ElectronAPI
    api: api
  }
}
